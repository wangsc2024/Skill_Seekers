# Autogen - Studio

**Pages:** 1

---

## Experimental Features — AutoGen

**URL:** https://microsoft.github.io/autogen/stable/user-guide/autogenstudio-user-guide/experimental.html

**Contents:**
- Experimental Features#
- Authentication#
  - Enable GitHub Authentication#

AutoGen Studio offers an experimental authentication feature to enable personalized experiences (multiple users). Currently, only GitHub authentication is supported. You can extend the base authentication class to add support for other authentication methods.

By default authenticatio is disabled and only enabled when you pass in the --auth-config argument when running the application.

To enable GitHub authentication, create a auth.yaml file in your app directory:

Generate a strong, unique JWT secret (at least 32 random bytes). You can run openssl rand -hex 32 to generate a secure random key.

Never commit your JWT secret to version control

In production, store secrets in environment variables or secure secret management services

Regularly rotate your JWT secret to limit the impact of potential breaches

The callback URL is the URL that GitHub will redirect to after the user has authenticated. It should match the URL you set in your GitHub OAuth application settings.

Ensure that the callback URL is accessible from the internet if you are running AutoGen Studio on a remote server.

Please see the documentation on GitHub OAuth for more details on obtaining the client_id and client_secret.

To pass in this configuration you can use the --auth-config argument when running the application:

Or set the environment variable:

Authentication is currently experimental and may change in future releases

User data is stored in your configured database

When enabled, all API endpoints require authentication except for the authentication endpoints

WebSocket connections require the token to be passed as a query parameter (?token=your-jwt-token)

**Examples:**

Example 1 (yaml):
```yaml
type: github
jwt_secret: "your-secret-key" # keep secure!
token_expiry_minutes: 60
github:
  client_id: "your-github-client-id"
  client_secret: "your-github-client-secret"
  callback_url: "http://localhost:8081/api/auth/callback"
  scopes: ["user:email"]
```

Example 2 (yaml):
```yaml
type: github
jwt_secret: "your-secret-key" # keep secure!
token_expiry_minutes: 60
github:
  client_id: "your-github-client-id"
  client_secret: "your-github-client-secret"
  callback_url: "http://localhost:8081/api/auth/callback"
  scopes: ["user:email"]
```

Example 3 (unknown):
```unknown
autogenstudio ui --auth-config /path/to/auth.yaml
```

Example 4 (unknown):
```unknown
autogenstudio ui --auth-config /path/to/auth.yaml
```

---
