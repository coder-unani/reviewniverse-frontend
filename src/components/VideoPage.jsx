import React from "react";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";
import { useAuthContext } from "/src/context/AuthContext";

const VideoPage = ({ screens, videos, handlePage }) => {
  const { user } = useAuthContext();

  return (
    <main className="main">
      <p style={{ wordBreak: "break-all" }}>{user ? JSON.stringify(user) : "null"}</p>
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
