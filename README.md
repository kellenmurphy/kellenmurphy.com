# [kellenmurphy.github.io](https://kellenmurphy.com)

Source for [kellenmurphy.com](https://kellenmurphy.com) — a Jekyll static site deployed via GitHub Actions to GitHub Pages.

## Local Development

```bash
bundle exec jekyll serve
```

## Structure

- `index.html`, `about.html`, `blog.html` — main pages
- `_md_pages/` — plain-text markdown alternates rendered at `/index.md`, `/about.md`, `/blog.md` for agent content negotiation (advertised via `<link rel="alternate" type="text/markdown">`)
- `.well-known/` — machine-readable discovery documents (included in Jekyll build via `_config.yml`)

## `.well-known` Endpoints

| Path | Spec | Purpose |
|------|------|---------|
| `/.well-known/openid-configuration` | OIDC Discovery | Declares no active authorization endpoints |
| `/.well-known/oauth-protected-resource` | RFC 9728 | Declares no protected APIs or auth requirements |
| `/.well-known/agent-skills/index.json` | agentskills.io v0.2 | Index of machine-readable site metadata (API catalog, MCP server card) |
| `/.well-known/api-catalog` | RFC 9727 | API catalog listing site resources |
| `/.well-known/mcp/server-card.json` | SEP-1649 | MCP server card describing this site |

## Deploying

Push to a branch and open a PR against `gh-pages`. GitHub Actions picks up the merge and redeploys in ~30 seconds.
