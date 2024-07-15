import React, { useEffect, useState } from "react";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

const VideoPage = ({ screens, videos, handelPage }) => {
  return (
    <main className="main">
      {screens &&
        screens.map((content, index) => (
          <HVideos key={index} content={content} />
        ))}
      {/* <Videos {...(type && { type })} /> */}
    </main>
  );
};

export default VideoPage;
