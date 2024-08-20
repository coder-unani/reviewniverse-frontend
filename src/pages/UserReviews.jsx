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
  const userId2Int = fParseInt(userId);
  const [reviews, setReviews] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
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

  useEffect(() => {
    if (userId2Int === 0) {
      return navigate("/404-not-found");
    }
  }, [userId2Int, navigate]);

  useEffect(() => {
    if (reviewsIsLoading || !reviewsData) {
      return;
    }
    if (!reviewsData.status) {
      if (videosData.code === "C001") {
        // TODO: 고도화 필요
        if (page > 1) setPage((prev) => prev - 1);
        // showErrorToast(MESSAGES["C001"]);
        return;
      } else {
        return navigate("/error");
      }
    }
    if (page === 1) {
      setReviews(reviewsData.data);
    } else {
      setReviews((prev) => {
        if (prev.page === videosData.data.page) return prev;
        return {
          ...prev,
          count: reviewsData.data.count,
          page: reviewsData.data.page,
          data: prev.data ? [...prev.data, ...reviewsData.data.data] : [],
        };
      });
    }
  }, [reviewsIsLoading, reviewsData, page]);

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  if (reviewsError) {
    return navigate("/error");
  }

  if (isEmpty(reviews)) {
    return;
  }

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
