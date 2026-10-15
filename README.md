> [!WARNING]
> # 🚧 WORK IN PROGRESS — NOT DONE YET 🚧
> This project is **unfinished**. Content, visuals and code are still changing.
> Expect missing sections, rough edges and breaking changes. See [`NOT_DONE_YET.md`](NOT_DONE_YET.md).

# 🚧 CSS Project (WIP — not done yet) 🚧

How QR codes recover from damage: a scroll page with a QR code that changes as you read.

Built with [Next.js](https://nextjs.org) (App Router), [Tailwind CSS](https://tailwindcss.com/) v4 and [shadcn/ui](https://ui.shadcn.com).

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
```

- The page is `src/app/page.tsx`. Its building blocks are in `src/components/story/`.
- QR generation and scanning live in `src/lib/qr.ts` and `src/lib/scan.ts`.
- Colours are the shadcn theme variables in `src/app/globals.css` (`:root`).

---

> [!CAUTION]
> 🚧 **Reminder: this is not finished.** Don't treat it as a final version. 🚧
