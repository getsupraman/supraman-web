# supraman-web

The supraman.ai landing page. Static files, no build step: `index.html`, `assets/site.css`,
the brand files in `assets/brand/` (copied from the brand kit at `P:\Projects\LarchSys\_Logo\supraman`)
and Archivo, subset to Latin and self-hosted in `assets/fonts/` (SIL OFL 1.1, license beside it).
The page loads nothing from other hosts and sets no cookies.

Preview locally: `python -m http.server 8765 --bind 127.0.0.1`, then open http://127.0.0.1:8765/.

## Deploy (GitHub Pages)

`CNAME` already holds `supraman.ai`. Push this folder as a repo under getsupraman, enable Pages on
`main` / root, then at the registrar:

- apex `supraman.ai`: A records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `www.supraman.ai`: CNAME `getsupraman.github.io`

Turn on "Enforce HTTPS" once the certificate is issued, and verify the domain for the org
(Settings → Pages → Add a domain) so no other account can claim it.
