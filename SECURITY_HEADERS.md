# Security Headers on GitHub Pages

GitHub Pages does not let this project set custom HTTP response headers such as
Content-Security-Policy, Strict-Transport-Security, Cross-Origin-Opener-Policy,
X-Frame-Options, or Trusted Types.

The site intentionally does not include fake `.htaccess` or header config files
because GitHub Pages would ignore them. Stronger headers should be configured at
the hosting/CDN layer, for example Cloudflare, Netlify, Vercel, or another
reverse proxy in front of GitHub Pages.

A strict CSP also needs testing with AdSense, Google Funding Choices, Firebase,
Google APIs, and image/font sources before deployment, otherwise it can break
ads, sign-in, or interactive site features.
