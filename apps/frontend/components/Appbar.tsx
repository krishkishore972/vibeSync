"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Appbar() {
  const session = useSession();

  return (
    <nav className="w-full h-14 flex items-center justify-between px-6 border-b border-[#E8A030]/10 bg-[#0E0C0A]">
      <h1 className="font-serif text-[18px] font-semibold text-[#F5EDD8] tracking-wide">
        Muzer
      </h1>

      <div className="flex items-center gap-3">
        {session.data?.user && (
          <>
            <span className="font-mono text-[12px] text-[#6B5F50]">
              @{session.data.user.name}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-[7px] rounded-xl bg-[#E8A030]/[0.08] hover:bg-[#E8A030]/[0.15] border border-[#E8A030]/20 text-[#C8892A] font-mono text-[12px] tracking-[0.05em] transition-colors cursor-pointer"
            >
              Log out
            </button>
          </>
        )}
        {!session.data?.user && (
          <button
            onClick={() => signIn()}
            className="px-4 py-[7px] rounded-xl bg-[#E8A030]/[0.08] hover:bg-[#E8A030]/[0.15] border border-[#E8A030]/20 text-[#C8892A] font-mono text-[12px] tracking-[0.05em] transition-colors cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}