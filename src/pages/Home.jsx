import React from "react";
import MovieRanking from "/src/components/MovieRanking";
import MovieList from "/src/components/MovieList";
import "/src/styles/Home.css";

/**
 * TODO:
 * 1. 페이지네이션 추가
 */

const Home = () => {
  return (
    <main className="main">
      <MovieRanking />
      <MovieList />
    </main>
  );
};

export default Home;
