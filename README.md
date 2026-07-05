# audiosoundboard.app

Landing page for **Sound Board - Audio Buttons** (iOS).

## Deploy

Hosted on [GitHub Pages](https://pages.github.com/) with custom domain `audiosoundboard.app`.

```bash
git push origin main
```

## GitHub Pages setup

1. Create repo `audiosoundboard` on GitHub (public)
2. Push this folder
3. **Settings → Pages →** deploy from `main` branch, root `/`
4. Set custom domain: `audiosoundboard.app`
5. Enable **Enforce HTTPS**

## Cloudflare DNS

For apex domain `audiosoundboard.app`:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `moonmoonnotsun.github.io` |

Set SSL mode to **Full** in Cloudflare.

## Links

- App Store: https://apps.apple.com/us/app/sound-board-audio-buttons/id6755937474
- Privacy: https://mpc-app-c2e7a.web.app/soundboard-privacy.html
- Terms: https://mpc-app-c2e7a.web.app/soundboard-terms.html
