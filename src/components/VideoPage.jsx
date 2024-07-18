import React from "react";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";

const VideoPage = ({ screens, videos, handlePage }) => {
  return (
    <main className="main">
      {screens && screens.map((content, index) => <HVideos key={index} content={content} />)}
      {videos && (
        <Videos videos={videos} handlePage={handlePage}>
          <div className="title-wrapper">
            <h2 className="title">주인님 내 새끼 구경 좀 해봐요 🦦</h2>
          </div>
        </Videos>
      )}
    </main>
  );
};

export default VideoPage;
