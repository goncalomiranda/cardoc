# GitHub Security Setup

This repository is configured with automated security scanning and dependency management.

## 🔒 Security Features Enabled

### 1. Dependabot (`.github/dependabot.yml`)

**What it does:**
- Automatically scans for outdated dependencies
- Creates pull requests to update vulnerable packages
- Runs weekly on Mondays at 9 AM UTC

**Covers:**
- Root dependencies (`package.json`)
- Backend dependencies (`backend/package.json`)
- Frontend dependencies (`frontend/package.json`)

**Configuration:**
- Groups minor/patch updates together
- Limits to 5 open PRs at a time
- Auto-labels PRs by category

### 2. Security Audit Workflow (`.github/workflows/security-audit.yml`)

**What it does:**
- Runs `npm audit` on all packages
- Checks for vulnerabilities in dependencies
- Reports outdated packages

**Triggers:**
- Every push to `main` branch
- Every pull request
- Weekly on Mondays at 9 AM UTC
- Manual trigger available

**Severity levels:**
- Moderate and above for all dependencies
- High and above for production dependencies

### 3. CodeQL Analysis (`.github/workflows/codeql-analysis.yml`)

**What it does:**
- Advanced static code analysis
- Detects security vulnerabilities in code
- Finds common coding errors

**Triggers:**
- Every push to `main` branch
- Every pull request
- Weekly on Mondays at 10 AM UTC
- Manual trigger available

**Scans for:**
- SQL injection
- XSS vulnerabilities
- Insecure dependencies
- Code quality issues
- Security best practices

### 4. Dependency Review (on PRs)

**What it does:**
- Reviews new dependencies in pull requests
- Flags packages with known vulnerabilities
- Checks license compatibility

**Blocks PRs with:**
- Moderate or higher severity vulnerabilities
- GPL-3.0 or AGPL-3.0 licenses

## 📊 Where to View Results

### Dependabot Alerts
1. Go to your repo on GitHub
2. Click **Security** tab
3. Click **Dependabot alerts**

### CodeQL Alerts
1. Go to your repo on GitHub
2. Click **Security** tab
3. Click **Code scanning alerts**

### Workflow Results
1. Go to your repo on GitHub
2. Click **Actions** tab
3. View recent workflow runs

## 🔔 Notifications

You'll receive GitHub notifications when:
- Dependabot creates a PR
- Security vulnerability is found
- Workflow fails
- New security advisory affects your dependencies

## 🛠️ Manual Security Checks

You can manually run security checks locally:

```bash
# Check for vulnerabilities in root
npm audit

# Check backend
cd backend && npm audit

# Check frontend
cd frontend && npm audit

# Fix auto-fixable issues
npm audit fix

# Check for outdated packages
npm outdated
```

## 🔄 Keeping Dependencies Updated

### Automated (via Dependabot)
- Weekly PRs for dependency updates
- Review and merge PRs regularly

### Manual Updates
```bash
# Update all packages to latest (respecting semver)
npm update

# Update to latest (including major versions)
npm install <package>@latest

# Update all workspaces
npm update --workspaces
```

## 🚨 Responding to Security Alerts

When you receive a security alert:

1. **Review the alert** - Understand the vulnerability
2. **Check if you're affected** - See if you use the vulnerable code
3. **Update the package** - Merge Dependabot PR or manually update
4. **Test thoroughly** - Ensure nothing breaks
5. **Deploy the fix** - Push to production

## 📋 Security Checklist

- [x] Dependabot enabled
- [x] Security audit workflow active
- [x] CodeQL analysis enabled
- [x] Dependency review on PRs
- [x] `.env` files in `.gitignore`
- [x] Security policy documented
- [ ] Enable GitHub Advanced Security (if private repo)
- [ ] Configure branch protection rules
- [ ] Require PR reviews before merge
- [ ] Enable signed commits (optional)

## 🔗 Resources

- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [npm audit Documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)

---

**Last Updated:** November 2025
