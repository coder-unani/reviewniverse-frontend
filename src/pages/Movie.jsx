import React from "react";
import MovieRanking from "/src/components/MovieRanking";
import MovieList from "/src/components/MovieList";

const Movie = () => {
  return (
    <main className="main">
      <MovieRanking type={10} />
      <MovieList type={10} />
    </main>
  );
};

export default Movie;
