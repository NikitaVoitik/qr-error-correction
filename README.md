# CSS Project

Built with [Next.js](https://nextjs.org) (App Router).

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
```

- Each page is a `page.tsx` inside `src/app/`, e.g. `src/app/about/page.tsx` is `/about`.
- `src/app/layout.tsx` wraps every page (the header lives here).
- Styling is [Tailwind CSS](https://tailwindcss.com/) v4. Colours are defined in `src/app/globals.css` under `@theme`.
