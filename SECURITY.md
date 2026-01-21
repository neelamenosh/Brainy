# Security Notice

## ⚠️ IMPORTANT: Credential Rotation Required

This repository was previously private and contained sensitive credentials in `.env` files that were committed to git history. Before making this repository public, the following credentials **MUST** be rotated:

### Affected Credentials
1. **Database Password** - The Supabase/PostgreSQL database password
2. **Supabase API Keys** - Both the `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
3. **JWT Secrets** - If any were committed

### Action Items
- [ ] Rotate the database password in your Supabase/PostgreSQL instance
- [ ] Rotate all Supabase API keys
- [ ] Generate new JWT secrets
- [ ] Update your production environment with the new credentials
- [ ] Update `.env` files locally (these are gitignored and won't be committed)

### For Future Contributors
- Never commit `.env` files or any files containing secrets
- Always use `.env.example` with placeholder values
- Keep all sensitive credentials in environment variables or secret management systems

## Reporting Security Issues

If you discover a security vulnerability in this project, please email the maintainers directly rather than opening a public issue.
