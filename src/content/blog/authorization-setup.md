---
title: "Authenticating and managing user logins with OAuth 2.0 and OpenID Connect"
slug: "authenticating-users-with-oauth"
date: 2026-07-26
topic: "architecture"
tags: ["security", "OAuth 2.0", "OpenID Connect"]
published: true
---
## Overview

Setting up the ability to authenticate users can be a messy process.  Here's a fairly exhaustive breakdown of how this application is applying OAuth 2.0 with OpenID Connect + PKCE.  

First here's an overview of the requests and responses.
![Flow of requests to login a user](/images/oauth_request_flow.png)

## Step 0: Check for cookie 
**GET** `/api/auth/me`. If a session cookie exists it is attached to the header of this request and this step is identical to step 6.  If the cookie doesn't exist, nothing is attached to the header and the express server will return a 401. 
```js
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setAuthStatus('authed');
        } else {
          setAuthStatus('anon');
        }
      })
      .catch(() => setAuthStatus('anon'));
```
The above fetch happens when a page on the app is loaded.  if a cookie is attached `res.ok` is true, otherwise, the auth status is noted as 'anon'.  This is fine because parts of the application require no login.  However, if you arrive on a page like `/interview` the auth status is checked for browser side.  If the auth status is 'anon' we server up the login page.  And for the following example, when I refer to 'Google' I'm referring to the provider.  Microsoft is also built in, but to keep things simple, lets just focus on one provider.

## Step 1: Browser to Express
**GET** `/api/auth/login/google`. Login page is shown here. User clicks login; triggers Express to start the flow. No information is passed (there isn't anything but 'anon' at this point).  Lets breakdown what happens inside this route. 

Here's the first important part.
```js
  const config = getConfig(provider);
  const code_verifier = client.randomPKCECodeVerifier();
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
  const state = client.randomState();
  const nonce = client.randomNonce();

  req.session.oauthState = { provider, code_verifier, state, nonce };
```
* `provider` here is just the provider as a string; either 'google' or 'microsoft'
* `config` is either the provider configuration that holds information later steps will need.  
* `code_verifier` is a cryptographically random string
* `code_challenge` is a SHA256 bit hashed version of code verifier.
* `state` is a cryptographically random string
* `nonce` is a cryptographically random string
* `req.session.oauthState` is the saved state in our session.  basically bundling everything above together to be held in the server session.

This is where we start building a set of codes that are used with the provider to get this user logged in securly. 

> Note: More about `config`.  `getConfig(provider)` could almost be considered step 1a. The express server makes a request to the provider and says "I need Oauth configuration stuff! here's my CLIENT_SECRET and CLIENT_ID" and the provider provides the up-to-date  endpoints we need to finish logging the user into the system. The CLIENT_SECRET and CLIENT_ID are server environmental variables I generated when registering my application with Microsoft and Google.  There are separate ids and secrets for each provider.  This information is used to acquire the config information and then itself is also stored in the config.

## Step 2: Express to Redis
**Write.** The express generated `code_verifier`, `code_challenge`, `state`, `nonce` and stores them in the session (`oauthState` property).

```js
  req.session.save((err) => {
    if (err) {
        console.error('[login] session save FAILED:', err);
        return res.status(500).send('Failed to start login');
    }

    res.redirect(authUrl.href);
  });
```

The session is saved out to redis with `req.session.save()`. If everything saved correctly, the res.redirect to the provider happens and we are at Step R1. 

At this point, we have a session started on our express server, the redis server has express session data.

## Step Response 1: Express to Browser
**302 redirect.** Sends `code_challenge`, `state`, `nonce`, On the front end, express redirects the browser to Google's auth URL. This sets the session cookie, but we aren't done. After this, the provider login is displayed for step 3.

## Step 3: Browser to Google
**GET** (browser navigation). URI carries `code_challenge`, `state`, `nonce`,  `CLIENT_ID`, `scope` and `redirect_uri` to Google's login page.  The user logs in. Then we start a short ping-pong match between the provider and express.  

> Note: The `redirect_uri` is a route that I had to define when setting up my application with Google.

## Step Response 2: Google to Browser
**302 redirect.** User is authenticated. Google sends back a short-lived `authorization_code` plus the original `state` to the designated `redirect_uri`.

## Step 4: Browser to Express
**GET** `/api/auth/callback/google`. Carries `code`, `state`, and the session cookie back to Express.  Now we are working with something!  We still only have a simple sort lived `authorization_code` though. We are only partway through. 

At this point, you might be worried about this authorization code going to the browser.  'Couldn't it be intercepted?!'  That is where Proof Key for Code Exchange `PKCE` comes in. The `code_verifier` and `code_challenge` come in to play very soon.

## Step 5: Express to Google
**POST** to Google's token endpoint. Sends `authorization_code`, `client_id`, `client_secret`, `code_verifier` — redeeming the code server-to-server.  This is the real request that gets us in the door. We have all our papers in order and we're presenting them to Google and saying 
"Look, I have the temp `authorization_code` that says I can be here see?  
"I also am who I say i am because of `client_id`, `client_secret`
"I'm not even messing with you man, I even have the `code_verifier`! Check it against the `code_challege`, you'll see i'm legit!

## Step Response 3: Google to Express
**JSON response.** Google validates everything and returns an access token and the signed ID token (JWT).
"All of your credentials are in order.  Here is the goods."  The response is verified as well.  The original oauth state is checked against information in the JWT token. In this case 'id_token' below would be what holds the JWT token.  The JWT token is the part where Open ID Connect (OIDC) extends OAuth. Where OAuth just says you can access this resource, OIDC is the part that provides the actual user.  It's an important distinction and easy to blur those lines a bit (I always have until doing this deeper dive!).  
```json
{
  "access_token": "ya29.a0AfH6...",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6...<JWT>...",
  "expires_in": 3599,
  "token_type": "Bearer",
  "scope": "openid profile email"
}
```
## Side Quest: Express to Redis
**Write.** Express extracts `sub`, `email`, `name` from the JWT and saves them as `req.session.user`. JWT itself is discarded.  This way, if you close your browser and come back, Redis has your information.  Note that the Redis server is the only place that sensitive information like 'email' are ever stored, and it is temporary storage. 

## Step R4: Express to Browser
**302 redirect.** Sends the browser back to the app homepage. Nothing sensitive in this response.

## Step 6: Browser to Express
**GET** (fetch) `/api/auth/me`. Session cookie goes out, user identity JSON comes back. Login confirmed.  We're back where we started but this time we have our session cookie and redis has our session information until the session expires or the user explicitly logs out.

And that's generally all there is to it. 

