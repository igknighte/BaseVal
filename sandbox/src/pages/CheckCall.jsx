import React, { useState } from "react";
import axios from "axios";

const KEY = "31dd5f19";

const fetchMovies = async (searchTerm) => {
  const response = await axios.get(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=${KEY}`,
  );
  return response.data;
};

function CheckCall() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setError("Please enter a search term");
      return;
    }
    setError("");
    try {
      const data = await fetchMovies(searchTerm);
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError("No movies found");
      }
    } catch (error) {
      setError("Error fetching data");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Search for Movies
      </h1>
      <form onSubmit={handleSearch} className="text-center mb-10">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter movie name"
        />
        <button
          type="submit"
          data-testid="search-button"
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
      {error && (
        <div
          data-testid="error-message"
          className="text-red-500 text-center mb-4"
        >
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            data-testid="movie-card"
            className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
          >
            <img
              className="w-full"
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/150"
              }
              alt={movie.Title}
            />
            <div className="px-6 py-4">
              <div
                className="font-bold text-xl mb-2"
                data-testid="movie-card-text"
              >
                {movie.Title}
              </div>
              <p className="text-gray-700 text-base">Year: {movie.Year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckCall;
export { fetchMovies };
