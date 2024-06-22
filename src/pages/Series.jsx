import React from "react";
import MovieRanking from "../components/MovieRanking";
import MainRanking from "/src/components/MainRanking";

const Series = () => {
  return (
    <main className="main">
      {/* <MovieRanking title={"넷플릭스 순위"} /> */}
      <MainRanking type={11} />
    </main>
  );
};

export default Series;
