export const Navbar = () => {
  return (
    <div>
      <nav className="p-4 flex justify-between items-center max-w-6xl mx-auto bg-white rounded-2xl mt-5 shadow-md">
        <div className="text-[#A294F9] font-bold text-2xl">
          <a href="/">LinkMe</a>
        </div>
        <div className="flex gap-4 items-center">
          <button className="px-4 py-2 text-[#8473f5]">Log in</button>
          <button className="px-4 py-2 text-[#8473f5] hover:text-white rounded-full hover:bg-[#5e48ef] transition-colors">
            Sign up free
          </button>
        </div>
      </nav>
    </div>
  );
};
