import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import SettingButton from "/src/components/Button/Setting";
import { useAuthContext } from "/src/context/AuthContext";
import { useUser } from "/src/hooks/useUser";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { formatNumber } from "/src/utils/format";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "/src/styles/User.css";
import { cLog, cError } from "/src/utils/test";
import { isEmpty } from "lodash";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: id } = useParams();
  const userId = parseInt(id);
  const { user, handleSetUser } = useAuthContext();
  const [isLogin, setIsLogin] = useState(false);
  const [profile, setProfile] = useState(null);

  const handleUserUpdate = ({ code, data }) => {
    toast.success(code, { position: "top-center", autoClose: 3000 });
    handleSetUser({ user: data });
    navigate(location.pathname, { replace: true, state: {} });
  };

  useEffect(() => {
    const { userUpdate } = location.state || {};
    const getUser = async () => {
      const res = await useUser({ userId });
      if (res.status) {
        setProfile(res.data);
        if (!isEmpty(userUpdate)) {
          handleUserUpdate({ code: userUpdate.code, data: res.data });
        }
      } else {
        cLog(res.code);
      }
    };
    getUser();
  }, [userId]);

  useEffect(() => {
    // 로그인한 유저가 있다면 userId와 로그인한 유저가 같은지 확인
    if (user && user.id === userId) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user, userId]);

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
                <Link to="">
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
      <ToastContainer />
    </main>
  );
};

export default User;
