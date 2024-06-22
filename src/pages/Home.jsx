import React from "react";
import MainRanking from "/src/components/MainRanking";
import "/src/styles/Home.css";

/**
 * TODO:
 * 1. 페이지네이션 추가
 */

const Home = () => {
  return (
    <main className="main">
      <MainRanking />
    </main>
  );
};

export default Home;
