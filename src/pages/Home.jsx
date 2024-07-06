import React from "react";
import { SCREEN_MAIN_ID } from "/src/config/types";
import VideoPage from "/src/components/VideoPage";
import "/src/styles/Home.css";

const Home = () => {
  return <VideoPage id={SCREEN_MAIN_ID} />;
};

export default Home;
