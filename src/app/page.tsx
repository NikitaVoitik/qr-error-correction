import QrPainter from "@/components/QrPainter";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="mb-2 text-3xl font-bold">QR code error correction</h1>
      <p className="mb-4 text-muted">
        Paint red over the QR code to damage it and watch whether it can still
        be read. You can also scan it with your phone.
      </p>
      <QrPainter />
    </main>
  );
}
