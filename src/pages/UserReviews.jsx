import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewItem from "/src/components/ReviewItem";
import { useUserReviews } from "/src/hooks/useUserReviews";
import { showErrorToast } from "/src/components/Toast";
import { MESSAGES } from "/src/config/messages";
import { fParseInt } from "/src/utils/format";
import { isEmpty } from "lodash";

const UserReviews = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [reviews, setReviews] = useState({ count: 0, page: 1, total: 0, data: [], user: {} });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const userId2Int = fParseInt(userId);

  // 리뷰 리스트
  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: reviewsIsLoading,
  } = useUserReviews({
    userId: userId2Int,
    page,
    pageSize,
    // orderBy: "created_at_desc",
    enabled: userId2Int,
  });

  // 페이지 변경
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (userId2Int === 0) {
      showErrorToast(MESSAGES.U006);
      navigate("/404-not-found");
    }
  }, [userId2Int, navigate]);

  useEffect(() => {
    if (reviewsIsLoading || !reviewsData || !reviewsData.status) return;
    if (page === 1) {
      setReviews(reviewsData.data);
    } else {
      setReviews((prev) => {
        return {
          ...prev,
          count: reviewsData.data.count,
          page: reviewsData.data.page,
          data: [...prev.data, ...reviewsData.data.data],
        };
      });
    }
  }, [reviewsData, reviewsIsLoading, page]);

  if (reviewsIsLoading) return null;
  if (reviewsError) return navigate("/error");

  return (
    <main className="reviews-main-container">
      <section className="reviews-title-section">
        <strong className="reviews-title">
          <em>{reviews.user.nickname}</em> 님이 기록한 리뷰가 {reviews.total} 개 있어요
        </strong>
      </section>
      <section className="reviews-content-section">
        {!isEmpty(reviews.data) &&
          reviews.data.map((review) => <ReviewItem key={review.id} user={reviews.user} review={review} />)}
      </section>
    </main>
  );
};

export default UserReviews;
