import React from "react";
import AllRanking from "/src/components/AllRanking";
import AllList from "/src/components/AllList";
import "/src/styles/Home.css";

/**
 * TODO:
 * 1. 페이지네이션 추가
 */

const Home = () => {
  return (
    <main className="main">
      <AllRanking />
      <AllList />
    </main>
  );
};

export default Home;
