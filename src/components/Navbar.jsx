import React from "react";
import logo from "../assets/logo.svg";

function Navbar() {
  return (
    <nav className="w-full bg-indigo-700 py-3 px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Fluidium Logo" className="h-8 w-8" />
        <span className="text-white text-xl font-bold tracking-wide">Fluidium</span>
      </div>
      <div className="flex gap-4 items-center">
        <a
          href="/"
          className="text-white opacity-80 hover:opacity-100 font-medium transition"
        >
          Home
        </a>
        <a
          href="#features"
          className="text-white opacity-80 hover:opacity-100 font-medium transition"
        >
          Features
        </a>
        <a
          href="#about"
          className="text-white opacity-80 hover:opacity-100 font-medium transition"
        >
          About
        </a>
        <a
          href="https://github.com/YOUR_USERNAME/fluidium"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white opacity-80 hover:opacity-100 font-medium transition"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
