import { MicrosoftMark, GoogleMark } from './icons/OAuthIcons';

export default function LoginScreen() {
  return (
    <main className="auth-screen">
      <div className="auth-card">
        <div className="auth-card-mark" aria-hidden="true">JN</div>
        <h1 className="auth-card-title">Sign in to continue</h1>
        <p className="auth-card-sub">The project demos are available to signed-in visitors.</p>

        <div className="auth-buttons">
          <a className="oauth-btn" href="/api/auth/login/microsoft">
            <MicrosoftMark />
            <span>Continue with Microsoft</span>
          </a>
          <a className="oauth-btn" href="/api/auth/login/google">
            <GoogleMark />
            <span>Continue with Google</span>
          </a>
        </div>

        <p className="auth-card-foot">Secured with OAuth 2.0 + OpenID Connect.</p>
      </div>
    </main>
  );
}
