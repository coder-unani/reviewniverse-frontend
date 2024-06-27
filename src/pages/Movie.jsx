import React from "react";
import AllRanking from "/src/components/AllRanking";
import AllList from "/src/components/AllList";

const Movie = () => {
  return (
    <main className="main">
      <AllRanking type={10} />
      <AllList type={10} />
    </main>
  );
};

export default Movie;
