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
- Ad / Traffic download redirect: https://audiosoundboard.app/download/
- Privacy: https://mpc-app-c2e7a.web.app/soundboard-privacy.html
- Terms: https://mpc-app-c2e7a.web.app/soundboard-terms.html

## `/download` (Meta Traffic ads)

GitHub Pages cannot do true HTTP 301/302. `download/index.html` uses meta refresh + JS `location.replace` plus a visible App Store button (needed when Instagram’s in-app browser blocks silent redirects).

In Meta Ads Manager → Traffic → Website URL use:

`https://audiosoundboard.app/download/`

Optional stronger redirect: Cloudflare → Rules → Redirect Rule  
`audiosoundboard.app/download*` → App Store URL (302).
