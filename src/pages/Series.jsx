import React from "react";
import { SCREEN_SERIES_ID } from "/src/config/types";
import VideoPage from "/src/components/VideoPage";

const Movie = () => {
  return <VideoPage id={SCREEN_SERIES_ID} type={11} />;
};

export default Movie;
