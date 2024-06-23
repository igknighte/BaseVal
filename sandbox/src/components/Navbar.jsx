import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        </li>
        <li>
          <Link to="/page" className="hover:underline">
            Page
          </Link>
        </li>
        <li>
          <Link to="/checkCall" className="hover:underline">
            CheckCall
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
