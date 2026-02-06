function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* <img src="/img/sicredi-logo.png" alt="Logo Sicredi" className="h-8" /> */}
        <h1>Logo</h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-700">Maira Moura</p>
          <img
            className="w-10 h-10 rounded-full"
            src="/img/avatar-perfil.png"
            alt="Avatar"
          />
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}

export default Header;
