"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Appbar() {
  const session = useSession();
  return (
    <nav className="bg-white shadow-md w-full h-16 flex items-center justify-between px-4">
      <div>
        <h1 className="text-xl font-bold">Muzer</h1>
      </div>
      <div className="flex items-center gap-4">
        {session.data?.user && (
          <div>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => {
                signOut();
              }}
            >
              LogOut
            </button>
          </div>
        )}
        {!session.data?.user && (
          <div>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => {
                signIn();
              }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
