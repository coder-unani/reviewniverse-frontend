import React, { useState, useEffect } from "react";
import VideoReviewItem from "/src/components/VideoReviewItem";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useVideoReviews } from "/src/hooks/useVideoReviews";
import { isEmpty } from "lodash";

const UserReviews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: id } = useParams();
  const userId = parseInt(id);
  const { nickname } = location.state || "";
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reviews, setReviews] = useState({ count: 0, page: 1, data: [] });
  // 리뷰 리스트
  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: reviewsIsLoading,
  } = useVideoReviews({ videoId: 10710, page: 1, pageSize: 8 });

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    // if (reviewsIsLoading || !hasMore) return;
    if (!reviewsData || !hasMore) return;
    if (page === 1) {
      setReviews(reviewsData);
    } else {
      if (page === 5) setHasMore(false);
      setReviews((prev) => {
        return {
          ...prev,
          count: reviewsData.count,
          page: reviewsData.page,
          data: [...prev.data, ...reviewsData.data],
        };
      });
    }
  }, [reviewsData, hasMore, page]);

  return (
    <main className="ratings-main-container">
      <section className="ratings-content-section">
        <strong className="ratings-content-title">
          <em>{nickname}</em> 님이 평가한 작품이 {reviews.total} 개 있어요
        </strong>
        {!isEmpty(reviews.data) && reviews.data.map((review) => <VideoReviewItem key={review.id} review={review} />)}
      </section>
    </main>
  );
};

export default UserReviews;
