import React from "react";
import AllRanking from "/src/components/AllRanking";
import AllList from "/src/components/AllList";

const Series = () => {
  return (
    <main className="main">
      <AllRanking type={11} />
      <AllList type={11} />
    </main>
  );
};

export default Series;
