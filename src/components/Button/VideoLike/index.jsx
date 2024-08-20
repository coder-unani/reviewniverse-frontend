import React from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { useVideoLike } from "/src/hooks/useVideoLike";
import { showSuccessToast } from "/src/components/Toast";

const VideoLikeButton = () => {
  const { user } = useAuthContext();
  const { toggleEnjoyModal } = useModalContext();
  const { videoId, myInfo } = useVideoDetailContext();
  const { mutate: videoLike, isPending: isLikePending } = useVideoLike();

  const handleLikeButton = async () => {
    if (!user) {
      toggleEnjoyModal();
      return;
    }
    if (isLikePending) {
      return;
    }
    await videoLike(
      { videoId, userId: user.id },
      {
        onSuccess: (res) => {
          if (res.status === 200) {
            const isLike = res.data.data.is_like;
            if (isLike) {
              showSuccessToast("좋아요 리스트에 추가되었습니다.");
            } else {
              showSuccessToast("좋아요 리스트에서 제외되었습니다.");
            }
          }
        },
      }
    );
  };

  return (
    <button type="button" className="detail-control like" onClick={handleLikeButton} disabled={isLikePending}>
      <span className={`detail-control-icon ${myInfo && myInfo.is_like ? "active" : ""}`}></span>
    </button>
  );
};

export default VideoLikeButton;
