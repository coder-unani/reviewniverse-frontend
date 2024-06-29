import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import SettingButton from "/src/components/Button/Setting";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatNumber } from "/src/utils/format";
import { isEmpty } from "lodash";
import { DEFAULT_IMAGES } from "/src/config/images";
import "/src/styles/User.css";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

const User = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  // 토큰 검증
  const tokenValidation = async () => {
    const access_token = sessionStorage.getItem("access_token");
    if (!access_token) return false;

    const client = new HttpClient(access_token);

    try {
      const res = await client.get(`${API_BASE_URL}/token`);
      if (res.status === 200) {
        return true;
      } else {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("access_token");
        setLoginUser(null);
        return false;
      }
    } catch (error) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      setLoginUser(null);
      return false;
    }
  };

  // 사용자 정보 가져오기
  const fetchData = async () => {
    try {
      const client = new HttpClient();
      client.get(`${API_BASE_URL}/users`, { uid: parseInt(userId) }).then((res) => {
        if (res.status === 200) {
          // res.code === "SEARCH_SUCC"
          setUser(res.data.data[0]);
        } else {
          cLog("사용자 정보를 불러오는데 실패하였습니다.");
          return;
        }
      });
    } catch (error) {
      cError(error);
    }
  };

  useEffect(() => {
    // 저장된 로그인 유저 정보 가져오기
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      // 로그인한 유저가 있다면 userId와 로그인한 유저가 같은지 확인
      const user = JSON.parse(storedUser);
      if (user.id === parseInt(userId)) {
        // 같다면 토큰 검증
        tokenValidation().then((isValid) => {
          if (!isValid) return;
          setUser(user);
          setIsLogin(true);
          return;
        });
      } else {
        // 다르다면 API 요청
        fetchData();
      }
    } else {
      // 로그인한 유저 정보가 없으면 API 요청
      fetchData();
    }
  }, [userId]);

  if (isEmpty(user)) return null;

  return (
    <main className="user-main">
      <div className="user-wrapper">
        <div className="user">
          <section className="user-info">
            {isLogin && <SettingButton />}
            <figure className="background">
              <LazyLoadImage src={DEFAULT_IMAGES.noImage} alt="배경 이미지" effect="blur" />
            </figure>
            <div className="user-profile">
              <ProfileImage image={user.profile_image} size={100} />
              <h1 className="nickname">{user.nickname}</h1>
              {user.profile_text && <p className="introduction">{user.profile_text}</p>}
            </div>
            <div className="user-contents">
              <Link to="">
                <p className="count">{formatNumber(user.rating_count)}</p>
                <p className="count-label">평가</p>
              </Link>
              <Link to="">
                <p className="count">{formatNumber(user.review_count)}</p>
                <p className="count-label">리뷰</p>
              </Link>
              <Link to="">
                <p className="count">{formatNumber(user.like_count)}</p>
                <p className="count-label">좋아요</p>
              </Link>
            </div>
          </section>
          <section className="storage"></section>
        </div>
      </div>
    </main>
  );
};

export default User;
