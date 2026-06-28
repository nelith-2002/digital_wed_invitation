import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf4ea] flex items-center justify-center px-6 text-center">
      <section className="w-full max-w-md rounded-[2rem] border border-[#c58a2b] bg-white/80 px-6 py-12 shadow-sm">
        <p className="tracking-[0.35em] text-[#b97a20] text-xs uppercase mb-6">
          Digital Invitation
        </p>

        <h1 className="text-4xl font-serif text-[#2f2119] mb-4">
          Rahal & Lalisha
        </h1>

        <p className="text-[#9b621b] leading-7 mb-8">
          Please choose an invitation page to preview.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/wedding"
            className="rounded-full bg-[#321d13] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#4a2a1c]"
          >
            Visit Wedding
          </Link>

          <Link
            href="/homecoming"
            className="rounded-full border border-[#c58a2b] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[#9b621b] transition hover:bg-[#f5ead8]"
          >
            Visit Homecoming
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#9b621b]/70">
          Final guests can still use the QR code provided on their invitation card.
        </p>
      </section>
    </main>
  );
}