const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl bg-black/90 border-b border-red-900/30 shadow-[0_20px_50px_rgba(255,0,0,0.2)]">
      <div className="group relative">
        <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 opacity-20 blur-xl group-hover:opacity-60 transition duration-500"></div>
        <div className="relative">
          <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-red-500 to-red-950 uppercase italic">
            DECKY
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-1">
            <div className="h-1 w-12 bg-red-600 rounded-full"></div>
            <div className="h-1 w-2 bg-red-900 rounded-full"></div>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 rounded-sm bg-gradient-to-r from-zinc-900 to-black border-l-2 border-red-600 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-100">
              Componente Épico
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;