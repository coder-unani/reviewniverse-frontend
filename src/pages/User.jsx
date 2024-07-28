import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import SettingButton from "/src/components/Button/Setting";
import { useAuthContext } from "/src/context/AuthContext";
import { useUser } from "/src/hooks/useUser";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { formatNumber } from "/src/utils/format";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "/src/styles/User.css";

const User = () => {
  const { userId: id } = useParams();
  const userId = parseInt(id);
  const { user } = useAuthContext();
  const [isLogin, setIsLogin] = useState(false);
  const { mutate: userGet, data: userData, error: userError, isLoading: userIsLoading } = useUser({ userId });

  useEffect(() => {
    userGet();
    // 로그인한 유저가 있다면 userId와 로그인한 유저가 같은지 확인
    if (user && user.id === userId) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [userGet, userId]);

  if (userIsLoading) {
  }

  return (
    <main className="user-main">
      <div className="user-wrapper">
        {userData && (
          <div className="user">
            <section className="user-info">
              {isLogin && <SettingButton />}
              <figure className="background">
                <LazyLoadImage src={DEFAULT_IMAGES.noImage} alt="배경 이미지" effect="blur" />
              </figure>
              <div className="user-profile">
                <ProfileImage image={userData.profile_image} size={100} />
                <h1 className="nickname">{userData.nickname}</h1>
                {userData.profile_text && <p className="introduction">{userData.profile_text}</p>}
              </div>
              <div className="user-contents">
                <Link to="">
                  <p className="count">{formatNumber(userData.rating_count)}</p>
                  <p className="count-label">평가</p>
                </Link>
                <Link to="">
                  <p className="count">{formatNumber(userData.review_count)}</p>
                  <p className="count-label">리뷰</p>
                </Link>
                <Link to="">
                  <p className="count">{formatNumber(userData.like_count)}</p>
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
