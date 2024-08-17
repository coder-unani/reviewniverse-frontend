import React from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useVideoLike } from "/src/hooks/useVideoLike";

const VideoLikeButton = ({ videoId, myInfo }) => {
  const { user } = useAuthContext();
  const { toggleEnjoyModal } = useModalContext();
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
