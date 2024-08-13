import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import SettingButton from "/src/components/Button/Setting";
import { useAuthContext } from "/src/context/AuthContext";
import { useUser } from "/src/hooks/useUser";
import { showErrorToast } from "/src/components/Toast";
import { formatNumber } from "/src/utils/format";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { MESSAGES } from "/src/config/messages";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { user, handleSetUser } = useAuthContext();
  const { mutateAsync: userFetch } = useUser();
  const [isLogin, setIsLogin] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const { isUserUpdate } = location.state || false;

    const getUser = async () => {
      try {
        const userId2Int = parseInt(userId);
        const res = await userFetch({ userId: userId2Int });
        if (res.status) {
          setProfile(res.data);

          // TODO: 고도화 필요
          if (isUserUpdate) {
            handleSetUser({ user: res.data });
            navigate(location.pathname, { replace: true, state: {} });
          }
        } else {
          showErrorToast(res.code);
          navigate(-1);
        }
      } catch (error) {
        showErrorToast(MESSAGES.U006);
        navigate(-1);
      }
    };
    getUser();
  }, [userId]);

  useEffect(() => {
    // TODO: 고도화 필요
    // 로그인한 유저가 있다면 userId와 로그인한 유저가 같은지 확인
    const userId2Int = parseInt(userId);
    if (user && user.id === userId2Int) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location, user, userId]);

  return (
    <main className="user-main">
      <div className="user-wrapper">
        {profile && (
          <div className="user">
            <section className="user-info">
              {isLogin && <SettingButton />}
              <figure className="background">
                <LazyLoadImage src={DEFAULT_IMAGES.noImage} alt="배경 이미지" effect="blur" />
              </figure>
              <div className="user-profile">
                <ProfileImage image={profile.profile_image} size={100} />
                <h1 className="nickname">{profile.nickname}</h1>
                {profile.profile_text && <p className="introduction">{profile.profile_text}</p>}
              </div>
              <div className="user-contents">
                <Link to={`/user/${userId}/contents/ratings`} state={{ nickname: profile.nickname }}>
                  <p className="count">{formatNumber(profile.rating_count)}</p>
                  <p className="count-label">평가</p>
                </Link>
                <Link to="">
                  <p className="count">{formatNumber(profile.review_count)}</p>
                  <p className="count-label">리뷰</p>
                </Link>
                <Link to="">
                  <p className="count">{formatNumber(profile.like_count)}</p>
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
