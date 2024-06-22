import React from "react";
import MovieRanking from "../components/MovieRanking";
import MainRanking from "/src/components/MainRanking";

const Movie = () => {
  return (
    <main className="main">
      {/* <MovieRanking title={"🎬 박스오피스 순위"} /> */}
      <MainRanking type={10} />
    </main>
  );
};

export default Movie;
