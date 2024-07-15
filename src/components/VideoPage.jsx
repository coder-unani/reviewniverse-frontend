import React from "react";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";

const VideoPage = ({ screens, videos, handlePage }) => {
  return (
    <main className="main">
      {screens && screens.map((content, index) => <HVideos key={index} content={content} />)}
      <Videos videos={videos} handlePage={handlePage} />
    </main>
  );
};

export default VideoPage;
