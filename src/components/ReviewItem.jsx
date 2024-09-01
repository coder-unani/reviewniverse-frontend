import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/Image";
import RatingReview from "/src/components/RatingReview";
import ReviewLikeButton from "/src/components/Button/ReviewLike";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { fYear, fDiffDate } from "/src/utils/format";
import { fVideoCode, fThumbnail } from "/src/utils/formatContent";
import MoreIcon from "/src/assets/button/fill-more.svg?react";

/**
 * TODO:
 * 1. 리뷰 스포일러 기능
 * 2. 리뷰 클릭시 리뷰 모달 열기
 */

const ReviewItem = ({ user, review }) => {
  const [data, setData] = useState(review);
  const [active, setActive] = useState(review.is_spoiler);
  const profileImage = user ? user.profile_image : DEFAULT_IMAGES.noActor;
  // TODO: data.video.id로 videoId를 받아오는 방법 찾기
  const path = EndpointManager.generateUrl(ENDPOINTS.VIDEO_DETAIL, { videoId: review.video.id });

  useEffect(() => {
    setData(review);
    setActive(review.is_spoiler);
  }, [review]);

  const handleSpoiler = () => {
    if (!active) return;
    setActive((prev) => !prev);
  };

  return (
    <div className="user-review-item">
      <div className="user-review-profile-wrapper">
        <ProfileImage image={profileImage} size={36} />
        <div className="user-review-profile-info-wrapper">
          <div className="user-review-nickname-wrapper">
            <span className="user-review-nickname">{user.nickname}</span>
            {data.rating && <RatingReview rating={data.rating} />}
          </div>
          <span className="user-review-date">{fDiffDate(data.created_at)}</span>
        </div>
        {/* <button className="review-more-button">
          <MoreIcon />
        </button> */}
      </div>
      <div className="user-review-video-wrapper">
        <Link to={path} className="user-review-video-link">
          <picture className="user-review-thumbnail-wrapper">
            <img className="user-review-thumbnail" src={fThumbnail(data.video.thumbnail)} alt={data.video.title} />
          </picture>
        </Link>
        <div className="user-review-wrapper">
          <div className="user-review-content-wrapper">
            <div className="user-review-video-info-wrapper">
              <span className="user-review-video-title">{data.video.title}</span>
              <span className="user-review-video-release">
                <span>{fVideoCode(data.video.code)}</span>
                <span>|</span>
                <span>{fYear(data.video.release)}</span>
              </span>
            </div>
            <div className="user-review-comment-wrapper" data-spoiler={data.is_spoiler}>
              {data.is_spoiler ? (
                <p className="user-review-comment" data-active={active} onClick={handleSpoiler}>
                  {data.title}
                </p>
              ) : (
                <p className="user-review-comment">{data.title}</p>
              )}
            </div>
          </div>
          <div className="user-review-more-wrapper">
            <ReviewLikeButton videoId={data.video.id} review={data} setReview={setData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
