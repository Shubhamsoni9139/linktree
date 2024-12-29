"use client";

import { useEffect, useState } from "react";

export const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="px-4">
      <nav className="p-4 flex justify-between items-center max-w-6xl mx-auto bg-zinc-900/50 backdrop-blur-sm rounded-2xl mt-5 border border-zinc-800">
        <div className="text-purple-400 font-bold text-2xl">
          <a href="/">LinkMe</a>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          {username ? (
            <>
              <a href="/profile">
                <button className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
                  Dashboard
                </button>
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-purple-400 hover:text-white rounded-full bg-zinc-800 hover:bg-purple-600 transition-colors text-sm sm:text-base"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="/login">
                <button className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
                  Log in
                </button>
              </a>
              <button className="px-4 py-2 text-purple-400 hover:text-white rounded-full bg-zinc-800 hover:bg-purple-600 transition-colors text-sm sm:text-base">
                Sign up free
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
