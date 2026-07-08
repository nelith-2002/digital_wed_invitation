import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#f6eee9] px-4 py-4 text-center sm:px-6">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#b77ab8]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#9f6aa0]/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      <section className="relative z-10 w-full max-w-4xl rounded-[1.8rem] border border-white/50 bg-white/45 p-3 shadow-[0_24px_70px_rgba(70,30,74,0.13)] backdrop-blur-md sm:p-4">
        <div className="rounded-[1.45rem] border border-[#a97231]/35 bg-[#fff8f2]/72 px-4 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
          <p className="mb-3 font-serif text-[0.65rem] font-bold uppercase tracking-[0.42em] text-[#a97231] sm:text-xs">
            Digital Invitation
          </p>

          <h1 className="mb-2 font-serif text-3xl font-semibold leading-tight text-[#2b202b] sm:text-4xl lg:text-[2.7rem]">
            Rahal &amp; Lalisha
          </h1>

          <p className="mx-auto mb-5 max-w-xl font-serif text-sm leading-6 text-[#76513e] sm:mb-6 sm:text-base">
            Welcome to the wedding and homecoming invitation preview. Please
            choose the invitation page you would like to view.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/wedding"
              className="group rounded-[1.25rem] border border-[#a97231]/45 bg-white/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#a97231] hover:bg-white/85 hover:shadow-[0_16px_38px_rgba(70,30,74,0.12)] sm:p-5"
            >
              <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#321d13] font-serif text-base text-[#f2d7a5] sm:h-10 sm:w-10">
                W
              </span>

              <h2 className="mb-1.5 font-serif text-xl font-semibold text-[#2b202b] sm:text-2xl">
                Wedding
              </h2>

              <p className="mb-4 font-serif text-xs leading-5 text-[#76513e] sm:text-sm sm:leading-6">
                View the wedding invitation page with ceremony details and event
                information.
              </p>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#321d13] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white transition group-hover:bg-[#4a2a1c] sm:px-5 sm:text-xs">
                Visit Wedding
                <span aria-hidden="true">→</span>
              </span>
            </Link>

            <Link
              href="/homecoming"
              className="group rounded-[1.25rem] border border-[#b710b9]/30 bg-white/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#9c2397] hover:bg-white/85 hover:shadow-[0_16px_38px_rgba(70,30,74,0.12)] sm:p-5"
            >
              <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#5a0858] font-serif text-base text-[#f2d7a5] sm:h-10 sm:w-10">
                H
              </span>

              <h2 className="mb-1.5 font-serif text-xl font-semibold text-[#2b202b] sm:text-2xl">
                Homecoming
              </h2>

              <p className="mb-4 font-serif text-xs leading-5 text-[#76513e] sm:text-sm sm:leading-6">
                View the homecoming invitation page with countdown, RSVP,
                location, and calendar details.
              </p>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#5a0858] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white transition group-hover:bg-[#6a0d67] sm:px-5 sm:text-xs">
                Visit Homecoming
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#a97231]/60 to-transparent" />
            <span className="font-serif text-xs text-[#76513e]">◇</span>
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#a97231]/60 to-transparent" />
          </div>

          <p className="mx-auto mt-4 max-w-xl font-serif text-xs leading-5 text-[#76513e]/80 sm:text-sm">
            Final guests can use the QR code printed on their invitation card to
            open the correct page directly.
          </p>
        </div>
      </section>
    </main>
  );
}