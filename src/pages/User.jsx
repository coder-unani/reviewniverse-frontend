import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/Image";
import SettingButton from "/src/components/Button/Setting";
import { useAuthContext } from "/src/context/AuthContext";
import { useUser } from "/src/hooks/useUser";
import { showErrorToast } from "/src/components/Toast";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { fParseInt, fNumberWithCommas } from "/src/utils/format";
import { LazyLoadImage } from "react-lazy-load-image-component";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const userId2Int = fParseInt(userId);
  const { user, handleSetUser, handleRemoveUser } = useAuthContext();
  const { mutateAsync: userFetch } = useUser();
  const [isLogin, setIsLogin] = useState(false);
  const [profile, setProfile] = useState(null);
  const pathRating = EndpointManager.generateUrl(ENDPOINTS.USER_RATINGS, { userId: userId2Int });
  const pathReview = EndpointManager.generateUrl(ENDPOINTS.USER_REVIEWS, { userId: userId2Int });
  const pathLike = EndpointManager.generateUrl(ENDPOINTS.USER_LIKES, { userId: userId2Int });

  useEffect(() => {
    if (userId2Int === 0) {
      return navigate(ENDPOINTS.NOT_FOUND);
    }

    const { isUserUpdate } = location.state || false;
    const getUser = async () => {
      const res = await userFetch({ userId: userId2Int });
      if (res.status) {
        setProfile(res.data);

        // TODO: 고도화 필요
        if (isUserUpdate) {
          handleSetUser({ user: res.data });
          navigate(location.pathname, { replace: true, state: {} });
        }
      } else {
        if (user && user.id === userId2Int) {
          handleRemoveUser();
        }
        navigate(-1);
        showErrorToast(res.code);
      }
    };

    getUser();
  }, [userId2Int]);

  useEffect(() => {
    // TODO: 고도화 필요
    // 로그인한 유저가 있다면 userId와 로그인한 유저가 같은지 확인
    if (user && user.id === userId2Int) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location, user, userId2Int]);

  return (
    <main className="user-main">
      <div className="user-wrapper">
        {profile && (
          <div className="user">
            <section className="user-info">
              {isLogin && <SettingButton />}
              <div className="background">
                <LazyLoadImage src={DEFAULT_IMAGES.noImage} alt="배경 이미지" effect="blur" />
              </div>
              <div className="user-profile">
                <ProfileImage image={profile.profile_image} size={100} />
                <h1 className="nickname">{profile.nickname}</h1>
                {profile.profile_text && <p className="introduction">{profile.profile_text}</p>}
              </div>
              <div className="user-contents">
                <Link to={pathRating}>
                  <p className="count">{fNumberWithCommas(profile.rating_count)}</p>
                  <p className="count-label">평가</p>
                </Link>
                <Link to={pathReview}>
                  <p className="count">{fNumberWithCommas(profile.review_count)}</p>
                  <p className="count-label">리뷰</p>
                </Link>
                <Link to={pathLike}>
                  <p className="count">{fNumberWithCommas(profile.like_count)}</p>
                  <p className="count-label">좋아요</p>
                </Link>
              </div>
            </section>
            <section className="storage"></section>
          </div>
        )}
      </div>
    </main>
  );
};

export default User;
