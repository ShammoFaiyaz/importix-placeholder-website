"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

function getCountdownEndMs(): number {
  const fromBuild = Number(process.env.NEXT_PUBLIC_COUNTDOWN_END_MS);
  if (Number.isFinite(fromBuild) && fromBuild > 0) {
    return fromBuild;
  }
  return Date.now() + THIRTY_DAYS_IN_MS;
}

type CountdownParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function getCountdown(targetTime: number, now: number): CountdownParts {
  const remaining = Math.max(0, targetTime - now);
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export default function Home() {
  const targetTimeRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [countdown, setCountdown] = useState<CountdownParts>({
    days: "30",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!targetTimeRef.current) {
      targetTimeRef.current = getCountdownEndMs();
    }

    let intervalId: ReturnType<typeof globalThis.setInterval> | undefined;

    const tick = () => {
      if (!targetTimeRef.current) {
        return;
      }

      const now = Date.now();
      if (targetTimeRef.current <= now) {
        setHasEnded(true);
        setCountdown(getCountdown(targetTimeRef.current, now));
        setIsReady(true);
        if (intervalId !== undefined) {
          globalThis.clearInterval(intervalId);
        }
        return;
      }

      setCountdown(getCountdown(targetTimeRef.current, now));
      setIsReady(true);
    };

    const timeout = globalThis.setTimeout(tick, 0);
    intervalId = globalThis.setInterval(tick, 1000);

    return () => {
      globalThis.clearTimeout(timeout);
      if (intervalId !== undefined) {
        globalThis.clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full min-w-0 overflow-hidden bg-black text-white">
      <Image
        alt="Background mountains"
        className="object-cover opacity-30"
        src="/website-bg.jpg?v=2"
        fill
        sizes="100vw"
        unoptimized
        priority
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-6 pt-5 md:px-10 md:pt-7">
        <header className="flex w-full items-center justify-center">
          <div className="flex items-center gap-3">
            <Image
              alt="Importix logo symbol"
              className="h-20 w-20 object-contain"
              src="/logo-icon.png"
              width={80}
              height={80}
              priority
            />
            <Image
              alt="Importix wordmark"
              className="h-20 w-auto object-contain"
              src="/text.png"
              width={625}
              height={100}
              priority
            />
          </div>
        </header>

        <main className="flex flex-1 items-start pb-4 pt-12 md:pb-6 md:pt-14">
          <div className="mx-auto flex w-full flex-col items-center">
            <p className="font-[var(--font-inter)] text-[10px] uppercase tracking-[0.45em] text-white/85">
              Releasing Soon
            </p>

            <section className="mt-6 w-full md:mt-8">
              {hasEnded ? (
                <h2 className="text-center font-[var(--font-manrope)] text-3xl font-bold tracking-tight text-white md:text-4xl">
                  We are coming soon
                </h2>
              ) : (
                <div className="grid w-full grid-cols-2 gap-y-8 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start md:justify-items-center">
                  <TimerBlock label="Days" value={countdown.days} isReady={isReady} />
                  <Separator isReady={isReady} />
                  <TimerBlock label="Hours" value={countdown.hours} isReady={isReady} />
                  <Separator isReady={isReady} />
                  <TimerBlock
                    label="Minutes"
                    value={countdown.minutes}
                    isReady={isReady}
                  />
                  <Separator isReady={isReady} />
                  <TimerBlock
                    label="Seconds"
                    value={countdown.seconds}
                    isReady={isReady}
                  />
                </div>
              )}
            </section>

            <section className="mt-16 max-w-3xl text-center md:mt-16">
              <h1 className="font-[var(--font-manrope)] text-3xl font-bold tracking-tight text-white md:text-5xl">
                Importix is Arriving.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl font-[var(--font-inter)] text-sm font-light leading-relaxed text-white/85 md:mt-5 md:text-base">
                Premium jerseys, smart gadgets, and custom 3D creations are
                launching soon across Bangladesh. Stay tuned.
              </p>
            </section>
          </div>
        </main>

        <footer className="flex w-full flex-col items-center gap-5 pt-2">
          <p className="font-[var(--font-inter)] text-[10px] uppercase tracking-[0.22em] text-white">
            © 2026 Importix. All Rights Reserved.
          </p>
          <nav
            aria-label="Footer links"
            className="flex items-center gap-8 font-[var(--font-inter)] text-[10px] uppercase tracking-[0.22em] text-white/85"
          >
            <a
              href="https://www.facebook.com/profile.php?id=61582901443732"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a href="https://www.instagram.com/importix.bd" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
}

function TimerBlock({
  value,
  label,
  isReady,
}: {
  value: string;
  label: string;
  isReady: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-[var(--font-manrope)] text-[clamp(3.1rem,10vw,6rem)] font-extralight leading-none tracking-[-0.06em] text-white tabular-nums ${
          isReady ? "visible" : "invisible"
        }`}
      >
        {value}
      </span>
      <span className="mt-3 font-[var(--font-inter)] text-[10px] uppercase tracking-[0.32em] text-white/85">
        {label}
      </span>
    </div>
  );
}

function Separator({ isReady }: { isReady: boolean }) {
  return (
    <div
      className={`hidden items-center pb-6 font-[var(--font-manrope)] text-5xl font-extralight text-white/40 md:flex ${
        isReady ? "visible" : "invisible"
      }`}
    >
      :
    </div>
  );
}
