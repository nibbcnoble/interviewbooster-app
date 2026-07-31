---
title: "Routing Across Microservices"
slug: "routing-across-microservices"
date: 2026-07-28
topic: "architecture"
tags: ["azure", "routing", "express", "react"]
published: false
---

## Who? What? Where?

This website/application/portfolio is not a monolith.  Instead it is separate pieces working together to deliver content. The following is a breakdown of how the routing works, as detailed as I could be.

First, lets talk about the components.  I'm going to separate this by Azure components:

## SWA (Static Web App): React application

The bundle that my react app file becomes has a few pieces of crucial routing direction:

**staticwebapp.config.json**

```js
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/*.{css,scss,js,png,jpg,svg,ico,json}"]
  }
}
```