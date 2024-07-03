import React from "react";
import MovieRanking from "/src/components/MovieRanking";
import MovieList from "/src/components/MovieList";

const Series = () => {
  return (
    <main className="main">
      <MovieRanking type={11} />
      <MovieList type={11} />
    </main>
  );
};

export default Series;
