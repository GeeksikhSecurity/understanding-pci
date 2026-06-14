# Understanding PCI for Small Business

A standalone plain-language PCI DSS v4.0.1 guide: **what is PCI**, who owns what when you accept
credit cards through a hosted processor (Stripe / PayPal), and how to stay compliant as a small
business or developer.

Linked from [securityleader.ai](https://securityleader.ai) and [sayvainc.com](https://sayvainc.com).

## What this is (and is not)

| This site **is** | This site **is not** |
|------------------|----------------------|
| A "what is PCI?" explainer for small businesses | A SAQ wizard or compliance automation tool |
| Myth-busting for owners and developers | Legal or QSA advice |
| SAQ A / A-EP decision primer + Stripe/PayPal links | A full PCI DSS crosswalk |
| A printable annual checklist | A substitute for your processor's AOC |

## Tabs

- **Quick Start** — What is PCI, who needs to act, SAQ guide, Stripe/PayPal processor links, printable checklist.
- **Responsibility Matrix** — 27 duties across 8 categories, filterable by owner.
- **Shared Responsibility** — Visual split + outsourcing trap callout.
- **Myths & Rules** — 12 corrected myths, developer do's & don'ts, password rules.

## Develop

```bash
npm install
npm run dev
```

## Live deployment

| | URL |
|---|-----|
| **Production** | https://understanding-pci.vercel.app |
| **GitHub** | https://github.com/GeeksikhSecurity/understanding-pci |
| **Vercel project** | https://vercel.com/singhs-kaurs/understanding-pci |

Pushes to `main` trigger a production deploy via GitHub Actions (`.github/workflows/vercel-deploy.yml`).

**One-time setup:** Add a `VERCEL_TOKEN` secret in [GitHub repo settings → Secrets](https://github.com/GeeksikhSecurity/understanding-pci/settings/secrets/actions). Create a token at [vercel.com/account/tokens](https://vercel.com/account/tokens) with access to the `singhs-kaurs` team.

Alternatively, connect the repo in [Vercel → Git settings](https://vercel.com/singhs-kaurs/understanding-pci/settings/git) (grant Vercel access to `understanding-pci` in GitHub App settings first).

### Custom domain (optional)

1. In [Vercel project settings → Domains](https://vercel.com/singhs-kaurs/understanding-pci/settings/domains), add e.g. `pci.securityleader.ai`.
2. Add the DNS record Vercel provides (CNAME or A).
3. Update `siteMeta.url` in `src/data.ts` and redeploy: `vercel deploy --prod --yes`

## Deploy to Vercel (standalone)

This is a **standalone site** — not embedded. Link to it from sayvainc.com, securityleader.ai, and similar pages under themes like "What is PCI?" or "Understanding PCI for small business."

```bash
npm i -g vercel
vercel
```

Or push to Git and import in Vercel. Config in `vercel.json` (build: `npm run build`, output: `dist`).

### Custom domain

1. Add a domain in Vercel project settings (e.g. `pci.securityleader.ai`).
2. Update `siteMeta.url` in `src/data.ts` to match — used in the printable checklist footer and SEO.

### Production notes

- **No environment variables** — fully static; nothing secret to configure.
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options: DENY` (standalone, not iframe), asset caching.
- **Linking from parent sites** — use anchor text like "Understanding PCI for small business" or "What is PCI DSS?" pointing to your Vercel URL.

## Printable checklist

The **Print / save as PDF** button on the Quick Start tab opens a formatted checklist in a new window with:

- Organization, renewal date, SAQ type, and processor checkboxes
- All 7 annual tasks with pen-and-paper checkboxes
- Notes section and partner footer links

Implementation: `src/printChecklist.ts`

## Stack

Vite + React 18 + TypeScript + Tailwind CSS 3 + lucide-react.

## Editing content

| File / export | Purpose |
|---------------|---------|
| `src/data.ts` → `siteMeta` | Title, URL, partner links |
| `src/data.ts` → `whatIsPci` | Intro copy |
| `src/data.ts` → `processorGuides` | Stripe/PayPal SAQ links |
| `src/data.ts` → `annualChecklist` | Checklist items (also used in print export) |
| `src/printChecklist.ts` | Print layout |

## Disclaimer

Content references PCI DSS v4.0.1. Awareness resource only — not a substitute for a QSA or processor AOC.
