import React from "react";
import { SCREEN_MOVIE_ID } from "/src/config/types";
import VideoPage from "/src/components/VideoPage";

const Movie = () => {
  return <VideoPage id={SCREEN_MOVIE_ID} type={10} />;
};

export default Movie;
