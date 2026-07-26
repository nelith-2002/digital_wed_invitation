"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/";
  }

  return nextPath;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = getSafeNextPath(searchParams.get("next"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Unable to login. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#f6eee9] px-4 py-8 text-center">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#b77ab8]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#9f6aa0]/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      <section className="relative z-10 w-full max-w-md rounded-[1.6rem] border border-white/50 bg-white/45 p-3 shadow-[0_24px_70px_rgba(70,30,74,0.13)] backdrop-blur-md">
        <div className="rounded-[1.35rem] border border-[#a97231]/35 bg-[#fff8f2]/80 px-6 py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#a97231]/45 bg-[#3b1239] shadow-sm">
            <Image
              src="/brand/lr-logo.png"
              alt="Rahal and Lalisha logo"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <p className="mb-3 font-serif text-[0.65rem] font-bold uppercase tracking-[0.32em] text-[#a97231]">
            Private Dashboard
          </p>

          <h1 className="mb-2 font-serif text-3xl font-semibold leading-tight text-[#2b202b]">
            Rahal &amp; Lalisha
          </h1>

          <p className="mx-auto mb-6 max-w-sm font-serif text-sm leading-6 text-[#76513e]">
            Enter your dashboard login details to view RSVP responses and live
            invitation status.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#76513e]"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl border border-[#76513e]/25 bg-white/70 px-4 font-serif text-base text-[#2b202b] outline-none transition focus:border-[#6a0d67] focus:bg-white focus:ring-4 focus:ring-[#6a0d67]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#76513e]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl border border-[#76513e]/25 bg-white/70 px-4 font-serif text-base text-[#2b202b] outline-none transition focus:border-[#6a0d67] focus:bg-white focus:ring-4 focus:ring-[#6a0d67]/10 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center font-serif text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#5a0858] px-5 font-serif text-sm font-bold uppercase tracking-[0.18em] text-[#fff8f2] transition hover:bg-[#6a0d67] disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? "Checking..." : "Login"}
            </button>
          </form>

          <p className="mt-5 font-serif text-xs leading-5 text-[#76513e]/75">
            Wedding and homecoming invitation pages remain public for guests.
          </p>
        </div>
      </section>
    </main>
  );
}