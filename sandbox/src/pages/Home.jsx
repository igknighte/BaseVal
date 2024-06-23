import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-blue-700 mb-10">
        Welcome to Home Page
      </h1>
      <div className="space-x-4">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          Home
        </Link>
        <Link to="/page" className="text-blue-500 hover:text-blue-700">
          Page
        </Link>
        <Link to="/checkCall" className="text-blue-500 hover:text-blue-700">
          Check Call
        </Link>
      </div>
    </div>
  );
}

export default Home;
