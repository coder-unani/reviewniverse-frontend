import React from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { useVideoLike } from "/src/hooks/useVideoLike";

const VideoLikeButton = () => {
  const { user } = useAuthContext();
  const { toggleEnjoyModal } = useModalContext();
  const { videoId, myInfo } = useVideoDetailContext();
  const { mutate: videoLike } = useVideoLike();

  const handleLikeButton = async () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    videoLike({ videoId, userId: user.id });
  };

  return (
    <button type="button" className="detail-control like" onClick={handleLikeButton}>
      <span className={`detail-control-icon ${myInfo && myInfo.is_like ? "active" : ""}`}></span>
    </button>
  );
};

export default VideoLikeButton;
