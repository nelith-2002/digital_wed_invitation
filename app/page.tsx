"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTO_REFRESH_INTERVAL = 10000;

const weddingRsvpLink =
  "https://docs.google.com/spreadsheets/d/1SBIUKJH5vYr39HUXD3amEffXp_0ysHmcIpOXUnbds6w/edit?gid=0#gid=0";

const homecomingRsvpLink =
  "https://docs.google.com/spreadsheets/d/1SBIUKJH5vYr39HUXD3amEffXp_0ysHmcIpOXUnbds6w/edit?gid=718636057#gid=718636057";

const summaryLink =
  "https://docs.google.com/spreadsheets/d/1SBIUKJH5vYr39HUXD3amEffXp_0ysHmcIpOXUnbds6w/edit?gid=1102955488#gid=1102955488";

type EventStats = {
  totalGuests: number;
  acceptedRsvps: number;
  declinedRsvps: number;
  totalResponses: number;
};

type DashboardStats = {
  wedding: EventStats;
  homecoming: EventStats;
  overall: EventStats;
};

type SiteStatus = "checking" | "live" | "issue";

type WebsiteHealth = {
  wedding: SiteStatus;
  homecoming: SiteStatus;
};

const emptyStats: DashboardStats = {
  wedding: {
    totalGuests: 0,
    acceptedRsvps: 0,
    declinedRsvps: 0,
    totalResponses: 0,
  },
  homecoming: {
    totalGuests: 0,
    acceptedRsvps: 0,
    declinedRsvps: 0,
    totalResponses: 0,
  },
  overall: {
    totalGuests: 0,
    acceptedRsvps: 0,
    declinedRsvps: 0,
    totalResponses: 0,
  },
};

const initialWebsiteHealth: WebsiteHealth = {
  wedding: "checking",
  homecoming: "checking",
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("/api/rsvp", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.stats) {
    throw new Error(data.message || "Unable to load RSVP stats.");
  }

  return data.stats as DashboardStats;
}

async function checkPageStatus(path: string): Promise<SiteStatus> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(path, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    return response.ok ? "live" : "issue";
  } catch {
    return "issue";
  } finally {
    window.clearTimeout(timeout);
  }
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M9 7H17V15" />
    </svg>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6a0d67] opacity-35" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#6a0d67]" />
    </span>
  );
}

function StatusDot({ status }: { status: SiteStatus }) {
  const dotClass =
    status === "live"
      ? "bg-emerald-500"
      : status === "issue"
        ? "bg-red-500"
        : "bg-[#a97231]";

  const pingClass =
    status === "live"
      ? "bg-emerald-500"
      : status === "issue"
        ? "bg-red-500"
        : "bg-[#a97231]";

  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-30 ${pingClass}`}
      />
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotClass}`}
      />
    </span>
  );
}

function NumberCard({
  label,
  value,
  subText,
}: {
  label: string;
  value: number;
  subText: string;
}) {
  return (
    <div className="rounded-[1.15rem] border border-[#a97231]/25 bg-white/65 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/85">
      <p className="mb-1 font-serif text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.62rem] sm:tracking-[0.28em]">
        {label}
      </p>

      <p className="font-serif text-3xl font-semibold leading-none text-[#2b202b] sm:text-4xl">
        {value}
      </p>

      <p className="mt-2 font-serif text-xs font-medium leading-5 text-[#76513e]">
        {subText}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#76513e]/15 bg-[#fff8f2]/75 px-2.5 py-2 text-center">
      <p className="font-serif text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#76513e]">
        {label}
      </p>

      <p className="mt-1 font-serif text-lg font-bold text-[#2b202b]">
        {value}
      </p>
    </div>
  );
}

function EventStatCard({
  label,
  value,
  accepted,
  declined,
  responses,
  variant,
}: {
  label: string;
  value: number;
  accepted: number;
  declined: number;
  responses: number;
  variant: "wedding" | "homecoming";
}) {
  const accentClass =
    variant === "wedding"
      ? "bg-[#321d13] text-[#f2d7a5]"
      : "bg-[#5a0858] text-[#f2d7a5]";

  return (
    <div className="rounded-[1.15rem] border border-[#a97231]/25 bg-white/65 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/85">
      <p className="mb-1 font-serif text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.62rem] sm:tracking-[0.28em]">
        {label}
      </p>

      <div className="flex items-end justify-between gap-3">
        <p className="font-serif text-3xl font-semibold leading-none text-[#2b202b] sm:text-4xl">
          {value}
        </p>

        <span
          className={`rounded-full px-3 py-1 font-serif text-[0.65rem] font-bold uppercase tracking-[0.16em] ${accentClass}`}
        >
          Guests
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniStat label="Accept" value={accepted} />
        <MiniStat label="Decline" value={declined} />
        <MiniStat label="Total" value={responses} />
      </div>
    </div>
  );
}

function TotalResponseCard({
  accepted,
  declined,
  total,
}: {
  accepted: number;
  declined: number;
  total: number;
}) {
  return (
    <div className="rounded-[1.15rem] border border-[#a97231]/25 bg-white/65 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/85">
      <p className="mb-1 font-serif text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.62rem] sm:tracking-[0.28em]">
        Total Responses
      </p>

      <div className="flex items-end justify-between gap-3">
        <p className="font-serif text-3xl font-semibold leading-none text-[#2b202b] sm:text-4xl">
          {total}
        </p>

        <span className="rounded-full bg-[#76513e] px-3 py-1 font-serif text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#f2d7a5]">
          RSVPs
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniStat label="Accepted" value={accepted} />
        <MiniStat label="Declined" value={declined} />
      </div>

      <p className="mt-3 font-serif text-xs font-medium leading-5 text-[#76513e]">
        Combined RSVP responses from both wedding and homecoming.
      </p>
    </div>
  );
}

function WebsiteStatusCard({
  title,
  path,
  status,
  variant,
}: {
  title: string;
  path: string;
  status: SiteStatus;
  variant: "wedding" | "homecoming";
}) {
  const isLive = status === "live";
  const isChecking = status === "checking";

  const statusText = isChecking ? "Checking" : isLive ? "Live" : "Issue";
  const statusDescription = isChecking
    ? "Checking the page availability."
    : isLive
      ? "The page is responding normally."
      : "The page may be unavailable or responding slowly.";

  const statusClass = isChecking
    ? "border-[#a97231]/35 bg-[#fff8f2]/80 text-[#76513e]"
    : isLive
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700";

  const badgeClass =
    variant === "wedding"
      ? "bg-[#321d13] text-[#f2d7a5]"
      : "bg-[#5a0858] text-[#f2d7a5]";

  return (
    <div className="rounded-2xl border border-[#76513e]/20 bg-white/55 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/75">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-semibold leading-tight text-[#2b202b]">
            {title}
          </p>

          <p className="mt-1 font-serif text-xs font-medium text-[#76513e]/80">
            {path}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-serif text-[0.65rem] font-bold uppercase tracking-[0.14em] ${statusClass}`}
        >
          <StatusDot status={status} />
          {statusText}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span
          className={`w-fit rounded-full px-3 py-1 font-serif text-[0.65rem] font-bold uppercase tracking-[0.16em] ${badgeClass}`}
        >
          {variant === "wedding" ? "Wedding" : "Homecoming"}
        </span>

        <p className="font-serif text-xs font-medium leading-5 text-[#76513e] sm:text-right">
          {statusDescription}
        </p>
      </div>
    </div>
  );
}

function InvitationCard({
  href,
  badge,
  title,
  description,
  buttonText,
  variant,
}: {
  href: string;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  variant: "wedding" | "homecoming";
}) {
  const isWedding = variant === "wedding";

  return (
    <Link
      href={href}
      className={`group rounded-[1.25rem] border bg-white/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_16px_38px_rgba(70,30,74,0.12)] sm:p-5 ${
        isWedding
          ? "border-[#a97231]/45 hover:border-[#a97231]"
          : "border-[#b710b9]/30 hover:border-[#9c2397]"
      }`}
    >
      <span
        className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full font-serif text-base text-[#f2d7a5] sm:h-10 sm:w-10 ${
          isWedding ? "bg-[#321d13]" : "bg-[#5a0858]"
        }`}
      >
        {badge}
      </span>

      <h2 className="mb-1.5 font-serif text-xl font-semibold text-[#2b202b] sm:text-2xl">
        {title}
      </h2>

      <p className="mb-4 font-serif text-xs leading-5 text-[#76513e] sm:text-sm sm:leading-6">
        {description}
      </p>

      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white transition sm:px-5 sm:text-xs ${
          isWedding
            ? "bg-[#321d13] group-hover:bg-[#4a2a1c]"
            : "bg-[#5a0858] group-hover:bg-[#6a0d67]"
        }`}
      >
        {buttonText}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

function SheetCard({
  href,
  badge,
  title,
  description,
  variant,
}: {
  href: string;
  badge: string;
  title: string;
  description: string;
  variant: "summary" | "wedding" | "homecoming";
}) {
  const badgeClass =
    variant === "wedding"
      ? "bg-[#321d13]"
      : variant === "homecoming"
        ? "bg-[#5a0858]"
        : "bg-[#76513e]";

  const hoverClass =
    variant === "homecoming"
      ? "hover:border-[#9c2397]"
      : "hover:border-[#a97231]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group rounded-2xl border border-[#76513e]/25 bg-[#fff8f2]/70 p-4 text-left transition duration-300 hover:-translate-y-1 hover:bg-white ${hoverClass}`}
    >
      <span
        className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full font-serif text-sm text-[#f2d7a5] ${badgeClass}`}
      >
        {badge}
      </span>

      <h3 className="mb-1 font-serif text-lg font-semibold text-[#2b202b]">
        {title}
      </h3>

      <p className="mb-3 font-serif text-xs leading-5 text-[#76513e]">
        {description}
      </p>

      <span className="inline-flex items-center gap-1.5 font-serif text-xs font-bold uppercase tracking-[0.18em] text-[#9b621b]">
        Open Sheet
        <ExternalIcon />
      </span>
    </a>
  );
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [websiteHealth, setWebsiteHealth] =
    useState<WebsiteHealth>(initialWebsiteHealth);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setError("");

        const [latestStats, weddingStatus, homecomingStatus] =
          await Promise.all([
            fetchDashboardStats(),
            checkPageStatus("/wedding"),
            checkPageStatus("/homecoming"),
          ]);

        if (!isMounted) {
          return;
        }

        setStats(latestStats);
        setWebsiteHealth({
          wedding: weddingStatus,
          homecoming: homecomingStatus,
        });
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      } catch {
        if (isMounted) {
          setError("Unable to load live dashboard data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboardData();

    const interval = window.setInterval(() => {
      void loadDashboardData();
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#f6eee9] px-3 py-4 text-center sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#b77ab8]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#9f6aa0]/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      <section className="relative z-10 w-full max-w-6xl rounded-[1.5rem] border border-white/50 bg-white/45 p-2.5 shadow-[0_24px_70px_rgba(70,30,74,0.13)] backdrop-blur-md sm:rounded-[1.8rem] sm:p-4">
        <div className="rounded-[1.25rem] border border-[#a97231]/35 bg-[#fff8f2]/72 px-4 py-5 sm:rounded-[1.45rem] sm:px-7 sm:py-7 lg:px-9 lg:py-8">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#a97231]/45 bg-[#3b1239] shadow-sm sm:h-16 sm:w-16">
            <Image
              src="/brand/lr-logo.png"
              alt="Rahal and Lalisha logo"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <p className="mb-3 font-serif text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[#a97231] sm:text-xs sm:tracking-[0.42em]">
            Digital Invitation Dashboard
          </p>

          <h1 className="mb-2 font-serif text-3xl font-semibold leading-tight text-[#2b202b] sm:text-4xl lg:text-[2.7rem]">
            Rahal &amp; Lalisha
          </h1>

          <p className="mx-auto mb-4 max-w-2xl font-serif text-sm leading-6 text-[#76513e] sm:mb-5 sm:text-base">
            Access the wedding and homecoming invitation pages, monitor RSVP
            responses, and check website availability from one place.
          </p>

          <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a97231]/25 bg-white/55 px-4 py-2">
              <LiveDot />

              <p className="font-serif text-xs font-semibold text-[#76513e]">
                {isLoading
                  ? "Loading live dashboard data..."
                  : lastUpdated
                    ? `Live dashboard auto-updated at ${lastUpdated}`
                    : "Live dashboard ready"}
              </p>
            </div>

            <p className="font-serif text-[0.7rem] font-medium text-[#76513e]/70">
              Auto refreshes every 10 seconds
            </p>
          </div>

          {error && (
            <p className="mx-auto mb-4 max-w-xl rounded-full border border-red-200 bg-red-50 px-4 py-2 font-serif text-xs font-semibold text-red-700">
              {error}
            </p>
          )}

          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <NumberCard
              label="Overall Guests"
              value={stats.overall.totalGuests}
              subText="Accepted guest count across both events."
            />

            <EventStatCard
              label="Wedding Guests"
              value={stats.wedding.totalGuests}
              accepted={stats.wedding.acceptedRsvps}
              declined={stats.wedding.declinedRsvps}
              responses={stats.wedding.totalResponses}
              variant="wedding"
            />

            <EventStatCard
              label="Homecoming Guests"
              value={stats.homecoming.totalGuests}
              accepted={stats.homecoming.acceptedRsvps}
              declined={stats.homecoming.declinedRsvps}
              responses={stats.homecoming.totalResponses}
              variant="homecoming"
            />

            <TotalResponseCard
              accepted={stats.overall.acceptedRsvps}
              declined={stats.overall.declinedRsvps}
              total={stats.overall.totalResponses}
            />
          </div>

          <div className="mb-5 rounded-[1.25rem] border border-[#a97231]/30 bg-white/45 p-4 sm:p-5">
            <p className="mb-4 font-serif text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.68rem] sm:tracking-[0.35em]">
              Website Status
            </p>

            <div className="grid gap-3 lg:grid-cols-2">
              <WebsiteStatusCard
                title="Wedding Website"
                path="/wedding"
                status={websiteHealth.wedding}
                variant="wedding"
              />

              <WebsiteStatusCard
                title="Homecoming Website"
                path="/homecoming"
                status={websiteHealth.homecoming}
                variant="homecoming"
              />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <InvitationCard
              href="/wedding"
              badge="W"
              title="Wedding Invitation"
              description="Open the wedding invitation page with ceremony details, location, calendar, and RSVP."
              buttonText="Visit Wedding"
              variant="wedding"
            />

            <InvitationCard
              href="/homecoming"
              badge="H"
              title="Homecoming Invitation"
              description="Open the homecoming invitation page with countdown, location, calendar, music, and RSVP."
              buttonText="Visit Homecoming"
              variant="homecoming"
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#a97231]/60 to-transparent" />
            <span className="font-serif text-xs text-[#76513e]">◇</span>
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#a97231]/60 to-transparent" />
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-[#a97231]/30 bg-white/45 p-4 sm:p-5">
            <p className="mb-4 font-serif text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.68rem] sm:tracking-[0.35em]">
              Couple RSVP Management
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <SheetCard
                href={summaryLink}
                badge="Σ"
                title="RSVP Summary"
                description="View total guests across wedding and homecoming."
                variant="summary"
              />

              <SheetCard
                href={weddingRsvpLink}
                badge="W"
                title="Wedding RSVP"
                description="View wedding guest responses and guest count."
                variant="wedding"
              />

              <SheetCard
                href={homecomingRsvpLink}
                badge="H"
                title="Homecoming RSVP"
                description="View homecoming guest responses and guest count."
                variant="homecoming"
              />
            </div>
          </div>

          <p className="mx-auto mt-4 max-w-xl font-serif text-xs leading-5 text-[#76513e]/80 sm:text-sm">
            Final guests can use the QR code printed on their invitation card to
            open the correct invitation page directly.
          </p>
        </div>
      </section>
    </main>
  );
}