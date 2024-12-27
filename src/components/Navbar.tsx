export const Navbar = () => {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username"); // Clear the username from cache
    window.location.href = "/login"; // Redirect to the login page
  };

  return (
    <div>
      <nav className="p-4 flex justify-between items-center max-w-6xl mx-auto bg-white rounded-2xl mt-5 shadow-md">
        <div className="text-[#A294F9] font-bold text-2xl">
          <a href="/">LinkMe</a>
        </div>
        <div className="flex gap-4 items-center">
          {username ? (
            <>
              <a href="/profile">
                <button className="px-4 py-2 text-[#8473f5]">Dashboard</button>
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-[#8473f5] hover:text-white rounded-full hover:bg-[#5e48ef] transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="/login">
                <button className="px-4 py-2 text-[#8473f5]">Log in</button>
              </a>
              <button className="px-4 py-2 text-[#8473f5] hover:text-white rounded-full hover:bg-[#5e48ef] transition-colors">
                Sign up free
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
