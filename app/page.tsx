"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import {
  HiOutlinePhoto,
  HiOutlineVideoCamera,
  HiOutlineCircleStack,
  HiOutlineRectangleStack,
} from "react-icons/hi2";

import IconixCodeCredit from "@/components/common/IconixCodeCredit";

const AUTO_REFRESH_INTERVAL = 10000;

const DASHBOARD_AUTH_REQUIRED_ERROR =
  "DASHBOARD_AUTH_REQUIRED";

const weddingRsvpLink =
  "https://docs.google.com/spreadsheets/d/1SBIUKJH5vYr39HUXD3amEffXp_0ysHmcIpOXUnbds6w/edit?gid=0#gid=0";

const homecomingRsvpLink =
  "https://docs.google.com/spreadsheets/d/1SBIUKJH5vYr39HUXD3amEffXp_0ysHmcIpOXUnbds6w/edit?gid=718636057#gid=718636057";

const summaryLink =
  "https://docs.google.com/spreadsheets/d/1SBIUKJH5vYr39HUXD3amEffXp_0ysHmcIpOXUnbds6w/edit?gid=1102955488#gid=1102955488";

const weddingDriveLink =
  "https://drive.google.com/drive/folders/1zyrzFIUikpKTrvdTzcoprlu6HjqI8_Kr";

const homecomingDriveLink =
  "https://drive.google.com/drive/folders/1Bm7W8S2S1TRGn_XAU208Rj7gr8a50bh0";

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

type SiteStatus =
  | "checking"
  | "live"
  | "issue";

type WebsiteHealth = {
  wedding: SiteStatus;
  homecoming: SiteStatus;
};

type MomentsEventStats = {
  totalFiles: number;
  photos: number;
  videos: number;
  otherFiles: number;
  storageBytes: number;
  latestUpload: string | null;
};

type MomentsStats = {
  wedding: MomentsEventStats;
  homecoming: MomentsEventStats;
  overall: MomentsEventStats;
};

type MomentsAnalyticsVariant =
  | "neutral"
  | "wedding"
  | "homecoming"
  | "photo"
  | "video"
  | "storage";

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

const emptyMomentsEventStats: MomentsEventStats = {
  totalFiles: 0,
  photos: 0,
  videos: 0,
  otherFiles: 0,
  storageBytes: 0,
  latestUpload: null,
};

const emptyMomentsStats: MomentsStats = {
  wedding: {
    ...emptyMomentsEventStats,
  },

  homecoming: {
    ...emptyMomentsEventStats,
  },

  overall: {
    ...emptyMomentsEventStats,
  },
};

const initialWebsiteHealth: WebsiteHealth = {
  wedding: "checking",
  homecoming: "checking",
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(
    "/api/rsvp",
    {
      method: "GET",
      cache: "no-store",
    }
  );

  let data: {
    success?: boolean;
    message?: string;
    stats?: DashboardStats;
  } = {};

  try {
    data =
      await response.json();
  } catch {
    throw new Error(
      "Unable to read RSVP stats."
    );
  }

  if (
    response.status === 401
  ) {
    throw new Error(
      DASHBOARD_AUTH_REQUIRED_ERROR
    );
  }

  if (
    !response.ok ||
    !data.success ||
    !data.stats
  ) {
    throw new Error(
      data.message ||
        "Unable to load RSVP stats."
    );
  }

  return data.stats;
}

async function fetchMomentsStats(): Promise<MomentsStats> {
  const response = await fetch(
    "/api/moments/stats",
    {
      method: "GET",
      cache: "no-store",
    }
  );

  let data: {
    success?: boolean;
    message?: string;
    stats?: MomentsStats;
  } = {};

  try {
    data =
      await response.json();
  } catch {
    throw new Error(
      "Unable to read Moments analytics."
    );
  }

  if (
    response.status === 401
  ) {
    throw new Error(
      DASHBOARD_AUTH_REQUIRED_ERROR
    );
  }

  if (
    !response.ok ||
    !data.success ||
    !data.stats
  ) {
    throw new Error(
      data.message ||
        "Unable to load Moments analytics."
    );
  }

  return data.stats;
}

async function checkPageStatus(
  path: string
): Promise<SiteStatus> {
  const controller =
    new AbortController();

  const timeout =
    window.setTimeout(
      () =>
        controller.abort(),
      6000
    );

  try {
    const response =
      await fetch(
        path,
        {
          method: "GET",
          cache: "no-store",
          signal:
            controller.signal,
        }
      );

    return response.ok
      ? "live"
      : "issue";
  } catch {
    return "issue";
  } finally {
    window.clearTimeout(
      timeout
    );
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

function StatusDot({
  status,
}: {
  status: SiteStatus;
}) {
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
    <div className="min-w-0 rounded-[1.15rem] border border-[#a97231]/25 bg-white/65 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/85">
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

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-[#76513e]/15 bg-[#fff8f2]/75 px-1.5 py-2.5 text-center sm:px-2 xl:px-1.5 2xl:px-2.5">
      <p className="w-full whitespace-nowrap font-serif text-[0.46rem] font-bold uppercase leading-none tracking-[0.035em] text-[#76513e] min-[390px]:text-[0.5rem] min-[480px]:text-[0.54rem] sm:text-[0.56rem] md:text-[0.58rem] xl:text-[0.5rem] 2xl:text-[0.58rem]">
        {label}
      </p>

      <p className="mt-2 font-serif text-lg font-bold leading-none text-[#2b202b]">
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
  variant:
    | "wedding"
    | "homecoming";
}) {
  const accentClass =
    variant === "wedding"
      ? "bg-[#321d13] text-[#f2d7a5]"
      : "bg-[#5a0858] text-[#f2d7a5]";

  return (
    <div className="min-w-0 rounded-[1.15rem] border border-[#a97231]/25 bg-white/65 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/85">
      <p className="mb-1 font-serif text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.62rem] sm:tracking-[0.28em]">
        {label}
      </p>

      <div className="flex min-w-0 items-end justify-between gap-2">
        <p className="font-serif text-3xl font-semibold leading-none text-[#2b202b] sm:text-4xl">
          {value}
        </p>

        <span
          className={`shrink-0 rounded-full px-3 py-1 font-serif text-[0.6rem] font-bold uppercase tracking-[0.12em] sm:text-[0.65rem] sm:tracking-[0.16em] ${accentClass}`}
        >
          Guests
        </span>
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-3 gap-1.5 sm:gap-2 xl:gap-1.5 2xl:gap-2">
        <MiniStat
          label="Accepted"
          value={accepted}
        />

        <MiniStat
          label="Declined"
          value={declined}
        />

        <MiniStat
          label="Total"
          value={responses}
        />
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
    <div className="min-w-0 rounded-[1.15rem] border border-[#a97231]/25 bg-white/65 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/85">
      <p className="mb-1 font-serif text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.62rem] sm:tracking-[0.28em]">
        Total Responses
      </p>

      <div className="flex min-w-0 items-end justify-between gap-3">
        <p className="font-serif text-3xl font-semibold leading-none text-[#2b202b] sm:text-4xl">
          {total}
        </p>

        <span className="shrink-0 rounded-full bg-[#76513e] px-3 py-1 font-serif text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#f2d7a5]">
          RSVPs
        </span>
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-2 gap-2">
        <MiniStat
          label="Accepted"
          value={accepted}
        />

        <MiniStat
          label="Declined"
          value={declined}
        />
      </div>

      <p className="mt-3 font-serif text-xs font-medium leading-5 text-[#76513e]">
        Combined RSVP responses
        from both wedding and
        homecoming.
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
  variant:
    | "wedding"
    | "homecoming";
}) {
  const isLive =
    status === "live";

  const isChecking =
    status === "checking";

  const statusText =
    isChecking
      ? "Checking"
      : isLive
        ? "Live"
        : "Issue";

  const statusDescription =
    isChecking
      ? "Checking the page availability."
      : isLive
        ? "The page is responding normally."
        : "The page may be unavailable or responding slowly.";

  const statusClass =
    isChecking
      ? "border-[#a97231]/35 bg-[#fff8f2]/80 text-[#76513e]"
      : isLive
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-red-200 bg-red-50 text-red-700";

  const badgeClass =
    variant === "wedding"
      ? "bg-[#321d13] text-[#f2d7a5]"
      : "bg-[#5a0858] text-[#f2d7a5]";

  return (
    <div className="min-w-0 rounded-2xl border border-[#76513e]/20 bg-white/55 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/75">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-serif text-lg font-semibold leading-tight text-[#2b202b]">
            {title}
          </p>

          <p className="mt-1 break-all font-serif text-xs font-medium text-[#76513e]/80 sm:break-normal">
            {path}
          </p>
        </div>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1 font-serif text-[0.65rem] font-bold uppercase tracking-[0.14em] ${statusClass}`}
        >
          <StatusDot
            status={status}
          />

          {statusText}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span
          className={`w-fit rounded-full px-3 py-1 font-serif text-[0.65rem] font-bold uppercase tracking-[0.16em] ${badgeClass}`}
        >
          {variant === "wedding"
            ? "Wedding"
            : "Homecoming"}
        </span>

        <p className="font-serif text-xs font-medium leading-5 text-[#76513e] sm:max-w-[65%] sm:text-right">
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
  variant:
    | "wedding"
    | "homecoming";
}) {
  const isWedding =
    variant === "wedding";

  return (
    <Link
      href={href}
      className={`group min-w-0 rounded-[1.25rem] border bg-white/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_16px_38px_rgba(70,30,74,0.12)] sm:p-5 ${
        isWedding
          ? "border-[#a97231]/45 hover:border-[#a97231]"
          : "border-[#b710b9]/30 hover:border-[#9c2397]"
      }`}
    >
      <span
        className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full font-serif text-base text-[#f2d7a5] sm:h-10 sm:w-10 ${
          isWedding
            ? "bg-[#321d13]"
            : "bg-[#5a0858]"
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

        <span aria-hidden="true">
          →
        </span>
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
  variant:
    | "summary"
    | "wedding"
    | "homecoming";
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
      className={`group min-w-0 rounded-2xl border border-[#76513e]/25 bg-[#fff8f2]/70 p-4 text-left transition duration-300 hover:-translate-y-1 hover:bg-white ${hoverClass}`}
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

function MomentsAccessCard({
  portalHref,
  driveHref,
  badge,
  title,
  description,
  variant,
}: {
  portalHref: string;
  driveHref: string;
  badge: string;
  title: string;
  description: string;
  variant:
    | "wedding"
    | "homecoming";
}) {
  const isWedding =
    variant === "wedding";

  const mainColor =
    isWedding
      ? "#321d13"
      : "#5a0858";

  return (
    <div
      className={`min-w-0 rounded-[1.2rem] border bg-white/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/80 sm:p-5 ${
        isWedding
          ? "border-[#a97231]/35"
          : "border-[#9c2397]/25"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-base text-[#f2d7a5]"
          style={{
            background:
              mainColor,
          }}
        >
          {badge}
        </span>

        <span
          className={`rounded-full px-3 py-1 font-serif text-[0.62rem] font-bold uppercase tracking-[0.15em] ${
            isWedding
              ? "bg-[#321d13]/8 text-[#6a452c]"
              : "bg-[#5a0858]/8 text-[#6a0d67]"
          }`}
        >
          Memories
        </span>
      </div>

      <h3 className="mt-3 font-serif text-xl font-semibold text-[#2b202b] sm:text-2xl">
        {title}
      </h3>

      <p className="mt-1.5 font-serif text-xs leading-5 text-[#76513e] sm:text-sm sm:leading-6">
        {description}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        <Link
          href={portalHref}
          className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition ${
            isWedding
              ? "bg-[#321d13] hover:bg-[#4a2a1c]"
              : "bg-[#5a0858] hover:bg-[#6a0d67]"
          }`}
        >
          Open Upload Portal

          <span aria-hidden="true">
            →
          </span>
        </Link>

        <a
          href={driveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full border border-[#76513e]/25 bg-[#fff8f2]/80 px-4 py-2.5 text-center text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#76513e] transition hover:border-[#a97231] hover:bg-white"
        >
          View Drive

          <ExternalIcon />
        </a>
      </div>
    </div>
  );
}

function MomentsAnalyticsIcon({
  variant,
}: {
  variant: MomentsAnalyticsVariant;
}) {
  const baseClasses =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm sm:h-11 sm:w-11";

  if (
    variant === "wedding"
  ) {
    return (
      <span
        className={`${baseClasses} bg-[#321d13] font-serif text-sm font-bold text-[#f2d7a5]`}
        aria-label="Wedding"
      >
        W
      </span>
    );
  }

  if (
    variant === "homecoming"
  ) {
    return (
      <span
        className={`${baseClasses} bg-[#5a0858] font-serif text-sm font-bold text-[#f2d7a5]`}
        aria-label="Homecoming"
      >
        H
      </span>
    );
  }

  if (
    variant === "photo"
  ) {
    return (
      <span
        className={`${baseClasses} bg-[#9b7650] text-white`}
        aria-label="Photos"
      >
        <HiOutlinePhoto
          className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
          aria-hidden="true"
        />
      </span>
    );
  }

  if (
    variant === "video"
  ) {
    return (
      <span
        className={`${baseClasses} bg-[#76513e] text-white`}
        aria-label="Videos"
      >
        <HiOutlineVideoCamera
          className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
          aria-hidden="true"
        />
      </span>
    );
  }

  if (
    variant === "storage"
  ) {
    return (
      <span
        className={`${baseClasses} border border-[#a97231]/25 bg-[#fff8f2] text-[#76513e]`}
        aria-label="Storage used"
      >
        <HiOutlineCircleStack
          className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} border border-[#a97231]/25 bg-[#fff8f2] text-[#76513e]`}
      aria-label="All memories"
    >
      <HiOutlineRectangleStack
        className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
        aria-hidden="true"
      />
    </span>
  );
}

function MomentsAnalyticsCard({
  label,
  value,
  description,
  variant = "neutral",
}: {
  label: string;
  value: string | number;
  description: string;
  variant?: MomentsAnalyticsVariant;
}) {
  return (
    <div className="relative flex min-w-0 flex-col rounded-[1.05rem] border border-[#a97231]/20 bg-white/62 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/85">
      {/*
        The title owns a protected text area.
        The icon is positioned independently at the top-right.
        This prevents HOMECOMING from ever colliding with H.
      */}
      <div className="min-h-11 min-w-0 pr-12 sm:pr-14">
        <p className="max-w-full break-words font-serif text-[0.52rem] font-bold uppercase leading-[1.4] tracking-[0.1em] text-[#a97231] min-[430px]:text-[0.55rem] sm:text-[0.58rem] xl:text-[0.52rem] 2xl:text-[0.6rem]">
          {label}
        </p>
      </div>

      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
        <MomentsAnalyticsIcon
          variant={variant}
        />
      </div>

      <p className="mt-3 break-words font-serif text-[clamp(1.75rem,4vw,2.35rem)] font-semibold leading-tight text-[#2b202b]">
        {value}
      </p>

      <p className="mt-3 font-serif text-xs leading-5 text-[#76513e]">
        {description}
      </p>
    </div>
  );
}

function formatStorage(
  bytes: number
) {
  if (
    !Number.isFinite(bytes) ||
    bytes <= 0
  ) {
    return "0 MB";
  }

  const kilobytes =
    bytes / 1024;

  const megabytes =
    kilobytes / 1024;

  const gigabytes =
    megabytes / 1024;

  if (gigabytes >= 1) {
    return `${gigabytes.toFixed(
      gigabytes >= 10
        ? 1
        : 2
    )} GB`;
  }

  if (megabytes >= 1) {
    return `${megabytes.toFixed(
      megabytes >= 10
        ? 1
        : 2
    )} MB`;
  }

  return `${Math.max(
    1,
    Math.round(kilobytes)
  )} KB`;
}

function formatLatestUpload(
  value: string | null
) {
  if (!value) {
    return "No uploads yet";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unavailable";
  }

  return date.toLocaleString(
    [],
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

async function downloadMomentsQrAsPng(
  event: "wedding" | "homecoming"
) {
  try {
    const url = `${window.location.origin}/moments/${event}`;

    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 1600,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = `${event}-moments-qr.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error(
      "Unable to generate QR PNG:",
      error
    );

    throw new Error(
      "Unable to download the QR code as PNG."
    );
  }
}

async function downloadMomentsQrAsPdf(
  event: "wedding" | "homecoming"
) {
  try {
    const url = `${window.location.origin}/moments/${event}`;

    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 1600,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const isWedding =
      event === "wedding";

    const title =
      isWedding
        ? "Wedding Moments"
        : "Homecoming Moments";

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);

    pdf.text(
      "Rahal & Lalisha",
      105,
      35,
      {
        align: "center",
      }
    );

    pdf.setFontSize(17);

    pdf.text(
      `${title} QR Code`,
      105,
      48,
      {
        align: "center",
      }
    );

    pdf.addImage(
      dataUrl,
      "PNG",
      45,
      65,
      120,
      120
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
      "Scan this QR code to share photos and videos from our special day.",
      105,
      200,
      {
        align: "center",
        maxWidth: 150,
      }
    );

    pdf.setFontSize(8);

    pdf.text(
      url,
      105,
      215,
      {
        align: "center",
        maxWidth: 160,
      }
    );

    pdf.save(
      `${event}-moments-qr.pdf`
    );
  } catch (error) {
    console.error(
      "Unable to generate QR PDF:",
      error
    );

    throw new Error(
      "Unable to download the QR code as PDF."
    );
  }
}

function MomentsQrDownloadCard({
  event,
  title,
  description,
}: {
  event:
    | "wedding"
    | "homecoming";
  title: string;
  description: string;
}) {
  const [
    downloadError,
    setDownloadError,
  ] =
    useState("");

  const [
    isDownloading,
    setIsDownloading,
  ] =
    useState<
      "png" | "pdf" | null
    >(null);

  const isWedding =
    event === "wedding";

  async function handlePngDownload() {
    try {
      setDownloadError("");
      setIsDownloading("png");

      await downloadMomentsQrAsPng(
        event
      );
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to download QR code."
      );
    } finally {
      setIsDownloading(null);
    }
  }

  async function handlePdfDownload() {
    try {
      setDownloadError("");
      setIsDownloading("pdf");

      await downloadMomentsQrAsPdf(
        event
      );
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to download QR code."
      );
    } finally {
      setIsDownloading(null);
    }
  }

  return (
    <div
      className={`min-w-0 rounded-[1.2rem] border bg-white/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/80 sm:p-5 ${
        isWedding
          ? "border-[#a97231]/35"
          : "border-[#9c2397]/25"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold text-[#f2d7a5] ${
            isWedding
              ? "bg-[#321d13]"
              : "bg-[#5a0858]"
          }`}
        >
          {isWedding
            ? "W"
            : "H"}
        </div>

        <span
          className={`rounded-full px-3 py-1 font-serif text-[0.62rem] font-bold uppercase tracking-[0.14em] ${
            isWedding
              ? "bg-[#321d13]/8 text-[#6a452c]"
              : "bg-[#5a0858]/8 text-[#6a0d67]"
          }`}
        >
          QR Code
        </span>
      </div>

      <h3 className="mt-3 font-serif text-xl font-semibold text-[#2b202b] sm:text-2xl">
        {title}
      </h3>

      <p className="mt-1.5 font-serif text-xs leading-5 text-[#76513e] sm:text-sm sm:leading-6">
        {description}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={
            handlePngDownload
          }
          disabled={
            isDownloading !== null
          }
          className={`inline-flex min-w-0 items-center justify-center rounded-full px-4 py-2.5 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isWedding
              ? "bg-[#321d13] hover:bg-[#4a2a1c]"
              : "bg-[#5a0858] hover:bg-[#6a0d67]"
          }`}
        >
          {isDownloading ===
          "png"
            ? "Preparing PNG..."
            : "Download PNG"}
        </button>

        <button
          type="button"
          onClick={
            handlePdfDownload
          }
          disabled={
            isDownloading !== null
          }
          className="inline-flex min-w-0 items-center justify-center rounded-full border border-[#76513e]/25 bg-[#fff8f2]/80 px-4 py-2.5 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#76513e] transition hover:border-[#a97231] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDownloading ===
          "pdf"
            ? "Preparing PDF..."
            : "Download PDF"}
        </button>
      </div>

      {downloadError && (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2"
          role="alert"
        >
          <p className="font-serif text-xs font-semibold leading-5 text-red-700">
            {downloadError}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const router =
    useRouter();

  const isDashboardDataLoadingRef =
    useRef(false);

  const [
    stats,
    setStats,
  ] =
    useState<DashboardStats>(
      emptyStats
    );

  const [
    momentsStats,
    setMomentsStats,
  ] =
    useState<MomentsStats>(
      emptyMomentsStats
    );

  const [
    websiteHealth,
    setWebsiteHealth,
  ] =
    useState<WebsiteHealth>(
      initialWebsiteHealth
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isMomentsLoading,
    setIsMomentsLoading,
  ] =
    useState(true);

  const [
    lastUpdated,
    setLastUpdated,
  ] =
    useState("");

  const [
    momentsLastUpdated,
    setMomentsLastUpdated,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    momentsError,
    setMomentsError,
  ] =
    useState("");

  async function handleLogout() {
    try {
      setError("");

      const response =
        await fetch(
          "/api/logout",
          {
            method: "POST",
          }
        );

      if (!response.ok) {
        setError(
          "Unable to logout. Please try again."
        );

        return;
      }

      router.replace(
        "/login"
      );

      router.refresh();
    } catch {
      setError(
        "Unable to logout. Please check your connection and try again."
      );
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (
        isDashboardDataLoadingRef.current
      ) {
        return;
      }

      isDashboardDataLoadingRef.current =
        true;

      try {
        setError("");
        setMomentsError("");

        const [
          latestStats,
          latestMomentsStats,
          weddingStatus,
          homecomingStatus,
        ] =
          await Promise.all([
            fetchDashboardStats(),
            fetchMomentsStats(),
            checkPageStatus(
              "/wedding"
            ),
            checkPageStatus(
              "/homecoming"
            ),
          ]);

        if (!isMounted) {
          return;
        }

        setStats(
          latestStats
        );

        setMomentsStats(
          latestMomentsStats
        );

        setWebsiteHealth({
          wedding:
            weddingStatus,

          homecoming:
            homecomingStatus,
        });

        const updatedTime =
          new Date().toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",

              minute:
                "2-digit",

              second:
                "2-digit",
            }
          );

        setLastUpdated(
          updatedTime
        );

        setMomentsLastUpdated(
          updatedTime
        );
      } catch (
        caughtError
      ) {
        if (
          caughtError instanceof
            Error &&
          caughtError.message ===
            DASHBOARD_AUTH_REQUIRED_ERROR
        ) {
          router.replace(
            "/login?next=%2F"
          );

          router.refresh();

          return;
        }

        if (isMounted) {
          setError(
            "Unable to load live dashboard data."
          );

          setMomentsError(
            "Unable to load Moments analytics right now. The upload portals and Drive folders are still available."
          );
        }
      } finally {
        isDashboardDataLoadingRef.current =
          false;

        if (isMounted) {
          setIsLoading(
            false
          );

          setIsMomentsLoading(
            false
          );
        }
      }
    }

    void loadDashboardData();

    const interval =
      window.setInterval(
        () => {
          void loadDashboardData();
        },
        AUTO_REFRESH_INTERVAL
      );

    return () => {
      isMounted = false;

      window.clearInterval(
        interval
      );
    };
  }, [router]);

  return (
    <main className="relative flex min-h-[100svh] w-full items-center justify-center overflow-x-hidden bg-[#f6eee9] px-3 py-4 text-center sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#b77ab8]/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#9f6aa0]/30 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      <section className="relative z-10 w-full min-w-0 max-w-6xl rounded-[1.5rem] border border-white/50 bg-white/45 p-2.5 shadow-[0_24px_70px_rgba(70,30,74,0.13)] backdrop-blur-md sm:rounded-[1.8rem] sm:p-4">
        <div className="min-w-0 rounded-[1.25rem] border border-[#a97231]/35 bg-[#fff8f2]/72 px-4 py-5 sm:rounded-[1.45rem] sm:px-7 sm:py-7 lg:px-9 lg:py-8">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={
                handleLogout
              }
              className="rounded-full border border-[#76513e]/25 bg-white/65 px-4 py-2 font-serif text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#76513e] transition hover:border-[#6a0d67] hover:bg-white hover:text-[#5a0858]"
            >
              Logout
            </button>
          </div>

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
            Digital Invitation
            Dashboard
          </p>

          <h1 className="mb-2 font-serif text-3xl font-semibold leading-tight text-[#2b202b] sm:text-4xl lg:text-[2.7rem]">
            Rahal &amp; Lalisha
          </h1>

          <p className="mx-auto mb-4 max-w-2xl font-serif text-sm leading-6 text-[#76513e] sm:mb-5 sm:text-base">
            Access the wedding and
            homecoming invitation
            pages, monitor RSVP
            responses, manage shared
            memories, and check
            website availability from
            one place.
          </p>

          <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#a97231]/25 bg-white/55 px-4 py-2">
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
              Auto refreshes every
              10 seconds
            </p>
          </div>

          {error && (
            <p className="mx-auto mb-4 max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-2 font-serif text-xs font-semibold leading-5 text-red-700 sm:rounded-full">
              {error}
            </p>
          )}

          <div className="mb-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <NumberCard
              label="Overall Guests"
              value={
                stats.overall
                  .totalGuests
              }
              subText="Accepted guest count across both events."
            />

            <EventStatCard
              label="Wedding Guests"
              value={
                stats.wedding
                  .totalGuests
              }
              accepted={
                stats.wedding
                  .acceptedRsvps
              }
              declined={
                stats.wedding
                  .declinedRsvps
              }
              responses={
                stats.wedding
                  .totalResponses
              }
              variant="wedding"
            />

            <EventStatCard
              label="Homecoming Guests"
              value={
                stats.homecoming
                  .totalGuests
              }
              accepted={
                stats.homecoming
                  .acceptedRsvps
              }
              declined={
                stats.homecoming
                  .declinedRsvps
              }
              responses={
                stats.homecoming
                  .totalResponses
              }
              variant="homecoming"
            />

            <TotalResponseCard
              accepted={
                stats.overall
                  .acceptedRsvps
              }
              declined={
                stats.overall
                  .declinedRsvps
              }
              total={
                stats.overall
                  .totalResponses
              }
            />
          </div>

          <div className="mb-5 min-w-0 rounded-[1.25rem] border border-[#a97231]/30 bg-white/45 p-4 sm:p-5">
            <p className="mb-4 font-serif text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.68rem] sm:tracking-[0.35em]">
              Website Status
            </p>

            <div className="grid min-w-0 gap-3 lg:grid-cols-2">
              <WebsiteStatusCard
                title="Wedding Website"
                path="/wedding"
                status={
                  websiteHealth.wedding
                }
                variant="wedding"
              />

              <WebsiteStatusCard
                title="Homecoming Website"
                path="/homecoming"
                status={
                  websiteHealth
                    .homecoming
                }
                variant="homecoming"
              />
            </div>
          </div>

          <div className="grid min-w-0 gap-3 lg:grid-cols-2">
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

            <span className="font-serif text-xs text-[#76513e]">
              ◇
            </span>

            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#a97231]/60 to-transparent" />
          </div>

          <div className="mt-5 min-w-0 rounded-[1.15rem] border border-[#a97231]/20 bg-[#fff8f2]/55 p-4 sm:p-5">
          <div className="mb-4 text-center">
            <p className="font-serif text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.68rem] sm:tracking-[0.32em]">
              Moments QR Codes
            </p>

            <p className="mx-auto mt-1 max-w-2xl font-serif text-xs leading-5 text-[#76513e] sm:text-sm">
              Download the correct guest QR code as PNG or PDF. Use the Moments cards below to open the upload portals or Drive folders.
            </p>
          </div>

          <div className="grid min-w-0 gap-3 lg:grid-cols-2">
            <MomentsQrDownloadCard
              event="wedding"
              title="Wedding Moments QR"
              description="Download the Wedding Moments QR code as a print-ready PNG or PDF for wedding guests."
            />

            <MomentsQrDownloadCard
              event="homecoming"
              title="Homecoming Moments QR"
              description="Download the Homecoming Moments QR code as a print-ready PNG or PDF for homecoming guests."
            />
          </div>
        </div>

          {/* MOMENTS & MEMORIES */}

          <div className="mt-5 min-w-0 rounded-[1.25rem] border border-[#a97231]/30 bg-white/45 p-4 sm:p-5">
            <div className="mb-4 flex min-w-0 flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
              <div className="min-w-0 text-center sm:text-left">
                <p className="font-serif text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.68rem] sm:tracking-[0.35em]">
                  Moments &amp;
                  Memories
                </p>

                <p className="mt-1 font-serif text-xs leading-5 text-[#76513e]">
                  Open guest upload
                  portals or view the
                  memories already
                  received in Google
                  Drive.
                </p>
              </div>

              <div className="inline-flex max-w-full shrink-0 items-center gap-2 rounded-full border border-[#a97231]/20 bg-white/60 px-3 py-2">
                <LiveDot />

                <span className="font-serif text-[0.67rem] font-semibold text-[#76513e]">
                  {isMomentsLoading
                    ? "Checking memories..."
                    : momentsLastUpdated
                      ? `Updated ${momentsLastUpdated}`
                      : "Memories ready"}
                </span>
              </div>
            </div>

            {momentsError && (
              <div
                className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left"
                role="status"
              >
                <p className="font-serif text-xs font-semibold leading-5 text-amber-800">
                  {momentsError}
                </p>
              </div>
            )}

            <div className="grid min-w-0 gap-3 lg:grid-cols-2">
              <MomentsAccessCard
                portalHref="/moments/wedding"
                driveHref={
                  weddingDriveLink
                }
                badge="W"
                title="Wedding Memories"
                description="Open the Wedding Moments upload portal or securely view the photos and videos received in the Wedding Google Drive folder."
                variant="wedding"
              />

              <MomentsAccessCard
                portalHref="/moments/homecoming"
                driveHref={
                  homecomingDriveLink
                }
                badge="H"
                title="Homecoming Memories"
                description="Open the Homecoming Moments upload portal or securely view the photos and videos received in the Homecoming Google Drive folder."
                variant="homecoming"
              />
            </div>

            <div className="mt-5 min-w-0">
              <div className="mb-3 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#a97231]/40 to-transparent" />

                <p className="font-serif text-[0.61rem] font-bold uppercase tracking-[0.22em] text-[#76513e]">
                  Moments Analytics
                </p>

                <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#a97231]/40 to-transparent" />
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 min-[440px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                <MomentsAnalyticsCard
                  label="All Memories"
                  value={
                    momentsStats
                      .overall
                      .totalFiles
                  }
                  description="Total files received."
                  variant="neutral"
                />

                <MomentsAnalyticsCard
                  label="Wedding"
                  value={
                    momentsStats
                      .wedding
                      .totalFiles
                  }
                  description="Wedding memories."
                  variant="wedding"
                />

                <MomentsAnalyticsCard
                  label="Homecoming"
                  value={
                    momentsStats
                      .homecoming
                      .totalFiles
                  }
                  description="Homecoming memories."
                  variant="homecoming"
                />

                <MomentsAnalyticsCard
                  label="Photos"
                  value={
                    momentsStats
                      .overall
                      .photos
                  }
                  description="Photo files received."
                  variant="photo"
                />

                <MomentsAnalyticsCard
                  label="Videos"
                  value={
                    momentsStats
                      .overall
                      .videos
                  }
                  description="Video files received."
                  variant="video"
                />

                <MomentsAnalyticsCard
                  label="Storage Used"
                  value={formatStorage(
                    momentsStats
                      .overall
                      .storageBytes
                  )}
                  description="Combined memory storage."
                  variant="storage"
                />
              </div>

              <div className="mt-3 min-w-0 rounded-xl border border-[#76513e]/15 bg-[#fff8f2]/65 px-4 py-3 text-left sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#a97231]">
                    Latest Memory
                  </p>

                  <p className="mt-1 break-words font-serif text-sm font-semibold text-[#2b202b]">
                    {formatLatestUpload(
                      momentsStats
                        .overall
                        .latestUpload
                    )}
                  </p>
                </div>

                <p className="mt-2 max-w-md font-serif text-xs leading-5 text-[#76513e] sm:mt-0 sm:text-right">
                  Analytics count the
                  files currently
                  stored inside the
                  Wedding and
                  Homecoming memory
                  folders.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#a97231]/60 to-transparent" />

            <span className="font-serif text-xs text-[#76513e]">
              ◇
            </span>

            <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#a97231]/60 to-transparent" />
          </div>

          {/* EXISTING RSVP MANAGEMENT */}

          <div className="mt-5 min-w-0 rounded-[1.25rem] border border-[#a97231]/30 bg-white/45 p-4 sm:p-5">
            <p className="mb-4 font-serif text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#a97231] sm:text-[0.68rem] sm:tracking-[0.35em]">
              Couple RSVP Management
            </p>

            <div className="grid min-w-0 gap-3 sm:grid-cols-3">
              <SheetCard
                href={summaryLink}
                badge="Σ"
                title="RSVP Summary"
                description="View total guests across wedding and homecoming."
                variant="summary"
              />

              <SheetCard
                href={
                  weddingRsvpLink
                }
                badge="W"
                title="Wedding RSVP"
                description="View wedding guest responses and guest count."
                variant="wedding"
              />

              <SheetCard
                href={
                  homecomingRsvpLink
                }
                badge="H"
                title="Homecoming RSVP"
                description="View homecoming guest responses and guest count."
                variant="homecoming"
              />
            </div>
          </div>

          <p className="mx-auto mt-4 max-w-xl font-serif text-xs leading-5 text-[#76513e]/80 sm:text-sm">
            Final guests can use the
            QR code printed on their
            invitation card to open
            the correct invitation
            page directly.
          </p>

          <IconixCodeCredit variant="dashboard" />
        </div>
      </section>
    </main>
  );
}