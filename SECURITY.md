# Security Policy

## 🔒 Security Best Practices

This project handles sensitive data including API keys and user authentication. Follow these guidelines to keep your deployment secure.

## ⚠️ NEVER Commit These Files/Data

### ❌ DO NOT commit:
- `.env` files (any environment)
- `dist/` folder
- `node_modules/`
- API keys or secrets
- User data
- Database credentials
- Authentication tokens

### ✅ Safe to commit:
- `.env.example` files (with placeholder values only)
- Source code
- `package.json` and `package-lock.json`
- Configuration files (without secrets)

## 🔑 Environment Variables

All sensitive configuration must be in environment variables, never hardcoded.

### Required Secret Variables:
- `GOOGLE_GEMINI_API_KEY` - Backend only, never expose to frontend
- `CLERK_SECRET_KEY` - Backend only, never expose to frontend

### Public Variables (safe to expose):
- `REACT_APP_CLERK_PUBLISHABLE_KEY` - Frontend, designed to be public
- `REACT_APP_BACKEND_URL` - Frontend, safe to expose

## 🛡️ API Key Security

### Google Gemini API Key
- **Location:** Backend `.env` only
- **Risk:** API usage costs, potential abuse
- **Protection:** 
  - Never commit to Git
  - Use different keys for dev/prod
  - Set usage limits in Google Cloud Console
  - Rotate keys periodically

### Clerk Secret Key
- **Location:** Backend `.env` only
- **Risk:** Full access to user data and admin operations
- **Protection:**
  - Never commit to Git
  - Use test keys for development
  - Use live keys for production only
  - Rotate if compromised

### Clerk Publishable Key
- **Location:** Frontend `.env`
- **Risk:** Low - designed to be public
- **Note:** This key is meant to be embedded in frontend and is safe to expose

## 🚨 If Keys Are Compromised

If you accidentally commit API keys or secrets to Git:

1. **Immediately rotate/regenerate** the exposed keys
2. **Revoke** the old keys in the provider's dashboard
3. **Clean Git history** (if public repo):
   ```bash
   # Use tools like git-filter-branch or BFG Repo-Cleaner
   # Better: Create a new repo and migrate clean code
   ```
4. **Update** `.env` files with new keys
5. **Redeploy** with new credentials

## 🔐 Production Deployment Security

### cPanel/Server Deployment:
1. Set environment variables in hosting panel (not in code)
2. Use production-grade keys (not test keys)
3. Enable HTTPS/SSL
4. Restrict CORS to your domain only
5. Keep dependencies updated (`npm audit`)
6. Use `NODE_ENV=production`

### Recommended cPanel Settings:
```bash
NODE_ENV=production
CLERK_SECRET_KEY=sk_live_xxx  # Use live keys
GOOGLE_GEMINI_API_KEY=xxx
```

## 📝 Reporting Security Issues

If you discover a security vulnerability, please email:
[your-email@example.com]

Do NOT open public issues for security vulnerabilities.

## ✅ Security Checklist Before Going Live

- [ ] All `.env` files in `.gitignore`
- [ ] No hardcoded API keys in source code
- [ ] Production keys configured on server (not in repo)
- [ ] HTTPS/SSL enabled
- [ ] CORS restricted to your domain
- [ ] Clerk authentication enabled on all API routes
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Rate limiting configured (if needed)
- [ ] Error messages don't expose sensitive info
- [ ] Logs don't contain secrets

## 🔄 Regular Security Maintenance

- Run `npm audit` monthly
- Update dependencies quarterly
- Rotate API keys annually
- Review access logs for suspicious activity
- Monitor API usage for anomalies

---

**Last Updated:** November 2025
