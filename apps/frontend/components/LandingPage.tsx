"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const MOCK_QUEUE = [
  { title: "Blinding Lights", user: "alex", votes: 24 },
  { title: "Levitating", user: "priya", votes: 17 },
  { title: "As It Was", user: "jordan", votes: 11 },
  { title: "Flowers", user: "sam", votes: 8 },
];

function FloatingSongCard({
  title,
  user,
  votes,
  style,
}: {
  title: string;
  user: string;
  votes: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#E8A030]/20 bg-[#161310]/90 backdrop-blur-sm shadow-xl"
      style={style}
    >
      <div className="flex flex-col items-center gap-[3px] shrink-0">
        <div className="w-5 h-4 flex items-center justify-center rounded text-[9px] border border-[#E8A030]/30 text-[#C8892A] bg-[#E8A030]/10">
          ▲
        </div>
        <span className="font-mono text-[11px] font-medium text-[#C8892A] tabular-nums">
          {votes}
        </span>
      </div>
      <div className="min-w-0">
        <p className="font-serif text-[13px] font-medium text-[#C8B89A] truncate max-w-[140px]">
          {title}
        </p>
        <p className="font-mono text-[10px] text-[#4A4038] mt-[2px]">@{user}</p>
      </div>
    </div>
  );
}

function NowPlayingMock() {
  return (
    <div className="relative w-full max-w-[340px] rounded-2xl overflow-hidden border border-[#E8A030]/20 bg-[#161310] shadow-2xl shadow-black/40">
      {/* Fake video thumbnail */}
      <div className="relative w-full aspect-video bg-[#0E0C0A] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A1F0E] to-[#0E0C0A]" />
        {/* Vinyl record illustration */}
        <div className="relative w-24 h-24 rounded-full border-4 border-[#E8A030]/20 bg-[#1A1410] flex items-center justify-center animate-[spin_8s_linear_infinite]">
          <div className="w-16 h-16 rounded-full border-2 border-[#E8A030]/10 bg-[#120F0A] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-[#E8A030]/20 bg-[#0E0C0A] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#C8892A]/60" />
            </div>
          </div>
          {/* Groove rings */}
          {[36, 44, 52, 60].map((r) => (
            <div
              key={r}
              className="absolute rounded-full border border-[#E8A030]/[0.04]"
              style={{ width: r * 2, height: r * 2 }}
            />
          ))}
        </div>
        {/* Play indicator */}
        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-[#E8A030]/20 border border-[#E8A030]/30 flex items-center justify-center">
          <span className="text-[#C8892A] text-[10px] ml-[2px]">▶</span>
        </div>
      </div>

      {/* Song info */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[15px] font-medium text-[#F5EDD8] truncate">
            Blinding Lights
          </p>
          <p className="font-mono text-[11px] text-[#6B5F50] mt-[3px]">
            added by <span className="text-[#C8892A]">@alex</span>
          </p>
        </div>
        <button className="ml-3 shrink-0 bg-[#E8A030]/[0.08] border border-[#E8A030]/20 text-[#C8892A] text-[11px] px-3 py-[6px] rounded-lg">
          Play Next ⏭
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-4 mb-3 h-[2px] rounded-full bg-[#E8A030]/10 overflow-hidden">
        <div className="h-full w-[38%] rounded-full bg-[#C8892A]/50" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const session = useSession();

  useEffect(() => {
    if (session.status == "loading") {
      return;
    }
    if (session.data?.user) {
      router.push("/dashboard");
    }
  },[session.status]);

  async function handleCreateRoom() {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/rooms");
      router.push(`/dashboard/${data.roomId}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#F5EDD8] overflow-x-hidden">
      {/* ── Noise grain overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Nav ── */}
      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#E8A030]/8">
        <span className="font-serif text-[22px] font-semibold tracking-wide text-[#F5EDD8]">
          Muzer
        </span>

        <div className="flex items-center gap-3">
          {session.data?.user ? (
            <>
              <span className="font-mono text-[12px] text-[#6B5F50]">
                @{session.data.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="px-5 py-[8px] rounded-xl border border-[#E8A030]/20 bg-[#E8A030]/[0.07] hover:bg-[#E8A030]/[0.15] text-[#C8892A] font-mono text-[12px] tracking-[0.06em] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-5 py-[8px] rounded-xl border border-[#E8A030]/20 bg-[#E8A030]/[0.07] hover:bg-[#E8A030]/[0.15] text-[#C8892A] font-mono text-[12px] tracking-[0.06em] transition-colors cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-32 md:pt-32 overflow-hidden"
      >
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, #E8A030 0%, transparent 70%)",
          }}
        />

        {/* Eyebrow tag */}
        <div className="mb-6 flex items-center gap-2 px-4 py-[6px] rounded-full border border-[#E8A030]/20 bg-[#E8A030]/[0.05]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#C8892A] animate-pulse" />
          <span className="font-mono text-[11px] tracking-[0.12em] text-[#C8892A] uppercase">
            Real-time collaborative listening
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl font-semibold text-[#F5EDD8] leading-[1.08] tracking-tight max-w-3xl">
          The music room
          <br />
          <span className="text-[#C8892A]">is open.</span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 font-sans text-[16px] md:text-[18px] text-[#6B5F50] max-w-md leading-relaxed">
          Create a room, invite your friends, add YouTube songs, and let the
          crowd vote what plays next.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="flex items-center gap-2 px-7 py-[13px] rounded-xl bg-[#E8A030] hover:bg-[#D4911F] text-[#0E0C0A] font-sans font-semibold text-[14px] tracking-wide transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-[#E8A030]/20"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 rounded-full border border-[#0E0C0A]/30 border-t-[#0E0C0A] animate-spin" />
                Creating…
              </>
            ) : (
              <>+ Create a Room</>
            )}
          </button>
        </div>

        {/* Visual mockup */}
        <div className="relative mt-20 w-full max-w-[700px] h-[380px] md:h-[420px]">
          {/* Center player */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <NowPlayingMock />
          </div>

          {/* Floating song cards */}
          <FloatingSongCard
            title="Levitating"
            user="priya"
            votes={17}
            style={{
              top: "8%",
              left: "2%",
              animation: "float 6s ease-in-out infinite",
              animationDelay: "0s",
            }}
          />
          <FloatingSongCard
            title="As It Was"
            user="jordan"
            votes={11}
            style={{
              top: "12%",
              right: "2%",
              animation: "float 6s ease-in-out infinite",
              animationDelay: "-2s",
            }}
          />
          <FloatingSongCard
            title="Flowers"
            user="sam"
            votes={8}
            style={{
              bottom: "10%",
              left: "3%",
              animation: "float 6s ease-in-out infinite",
              animationDelay: "-4s",
            }}
          />
          <FloatingSongCard
            title="Starboy"
            user="mike"
            votes={5}
            style={{
              bottom: "12%",
              right: "3%",
              animation: "float 6s ease-in-out infinite",
              animationDelay: "-1s",
            }}
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 px-6 md:px-12 py-24 border-t border-[#E8A030]/8">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#C8892A] uppercase mb-3 text-center">
            How it works
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F5EDD8] text-center mb-16">
            Three steps to a shared vibe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "🎙",
                title: "Open a room",
                desc: "Hit create and get a shareable invite link in seconds. No signup needed for guests.",
              },
              {
                step: "02",
                icon: "🔗",
                title: "Drop a YouTube link",
                desc: "Paste any YouTube URL and it joins the queue instantly, pulled by title.",
              },
              {
                step: "03",
                icon: "🗳",
                title: "Vote it up",
                desc: "Everyone votes. The top-ranked track plays next. Democracy, but make it music.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div
                key={step}
                className="relative flex flex-col gap-4 px-6 py-7 rounded-2xl border border-[#E8A030]/10 bg-[#161310] hover:border-[#E8A030]/25 transition-colors group"
              >
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#E8A030]/30 group-hover:text-[#C8892A]/60 transition-colors">
                  {step}
                </span>
                <span className="text-2xl">{icon}</span>
                <h3 className="font-serif text-[17px] font-medium text-[#C8B89A]">
                  {title}
                </h3>
                <p className="font-sans text-[13px] text-[#6B5F50] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 md:px-12 py-24 border-t border-[#E8A030]/8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Live voting",
              desc: "Upvote or downvote any track in the queue. Votes update in real-time across every device in the room.",
              accent: "▲",
            },
            {
              label: "YouTube integration",
              desc: "Paste a link and we do the rest — title extraction, ID parsing, seamless autoplay when it's up.",
              accent: "▶",
            },
            {
              label: "Room listeners",
              desc: "See who's in the room live. The host controls playback; everyone else vibes along.",
              accent: "◉",
            },
            {
              label: "Instant invite",
              desc: "One link, shareable anywhere. No app download, no account required to join as a listener.",
              accent: "⇥",
            },
          ].map(({ label, desc, accent }) => (
            <div
              key={label}
              className="flex gap-5 px-6 py-6 rounded-2xl border border-[#E8A030]/8 bg-[#161310] hover:border-[#E8A030]/20 transition-colors"
            >
              <div className="shrink-0 w-8 h-8 rounded-lg bg-[#E8A030]/[0.08] border border-[#E8A030]/15 flex items-center justify-center font-mono text-[14px] text-[#C8892A] mt-[2px]">
                {accent}
              </div>
              <div>
                <h3 className="font-serif text-[16px] font-medium text-[#C8B89A] mb-2">
                  {label}
                </h3>
                <p className="font-sans text-[13px] text-[#6B5F50] leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="relative z-10 px-6 md:px-12 py-24 border-t border-[#E8A030]/8">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-7 py-16 px-8 rounded-3xl border border-[#E8A030]/15 bg-[#161310]">
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-5"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, #E8A030 0%, transparent 70%)",
            }}
          />
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#C8892A] uppercase">
            Ready to listen?
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F5EDD8] leading-snug">
            Start a room for free.
            <br />
            <span className="text-[#C8892A]">Right now.</span>
          </h2>
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="px-8 py-[14px] rounded-xl bg-[#E8A030] hover:bg-[#D4911F] text-[#0E0C0A] font-sans font-semibold text-[15px] tracking-wide transition-colors cursor-pointer shadow-lg shadow-[#E8A030]/25 disabled:opacity-50"
          >
            {loading ? "Creating…" : "+ Create a Room"}
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-[#E8A030]/8 flex items-center justify-between">
        <span className="font-serif text-[16px] text-[#4A4038]">Muzer</span>
        <span className="font-mono text-[11px] text-[#4A4038]">
          Built for music people
        </span>
      </footer>

      {/* Float keyframe animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
