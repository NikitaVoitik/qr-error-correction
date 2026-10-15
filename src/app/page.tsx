import QrPainter from "@/components/QrPainter";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="mb-2 text-3xl font-bold">QR code error correction</h1>
      <p className="mb-4 text-muted">
        Paint red over the QR code to damage it, then try scanning it with your
        phone. It should still work until roughly 30% is damaged.
      </p>
      <QrPainter />
    </main>
  );
}
