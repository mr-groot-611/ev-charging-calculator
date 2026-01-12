---
description: How to deploy new changes to the live website
---

# How to Deploy Changes

Since we connected Cloudflare Pages to your GitHub repository, deployment is **automatic**. You do not need to log in to Cloudflare or run build commands manually.

## The Workflow

1.  **Make your changes** in the code.
2.  **Verify locally** by running `npm run dev`.
3.  **Push to GitHub** using the terminal.

## Run this command to deploy:

```bash
git add .
git commit -m "Describe your changes here"
git push
```

**That's it!**
Cloudflare will detect the new commit, build your site, and update `myevmath.com` within ~60 seconds.
