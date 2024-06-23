import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded user credentials for verification
    const validUsername = "user";
    const validPassword = "password";

    if (username !== validUsername || password !== validPassword) {
      setError("Invalid username or password");
      return;
    }

    setError("");
    navigate("/checkCall");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Login
      </h1>
      <form onSubmit={handleSubmit} className="text-center mb-10">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Username"
          data-testid="username-input"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Password"
          data-testid="password-input"
        />
        <br />
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="login-button"
        >
          Login
        </button>
      </form>
      {error && (
        <div
          className="text-red-500 text-center mb-4"
          data-testid="error-message"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default Login;
