import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { RiArrowRightSLine } from "@remixicon/react";
import { formatNumber } from "/src/utils/format";
import { isEmpty } from "lodash";
import { DEFAULT_IMAGES } from "/src/config/images";
import "/src/styles/User.css";
import { cLog, cError } from "/src/utils/test";

const User = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [loginUser, setLoginUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new HttpClient();
        client.get("https://comet.orbitcode.kr/v1/users", { uid: parseInt(userId) }).then((res) => {
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

    fetchData();
  }, []);

  useEffect(() => {
    console.log(loginUser.id);
  }, [loginUser]);

  if (isEmpty(user)) return null;

  return (
    <main className="user-main">
      <div className="user-wrapper">
        <div className="user">
          <section className="user-info">
            <figure className="background">
              <LazyLoadImage src={DEFAULT_IMAGES.noImage} alt="배경 이미지" effect="blur" />
            </figure>
            <div className="user-profile">
              <ProfileImage image={user.profile_image} size={100} />
              {loginUser && loginUser.id === user.id ? (
                <Link to="/user/profile" className="edit-profile">
                  <h1 className="nickname">{user.nickname}</h1>
                  <RiArrowRightSLine size={20} />
                </Link>
              ) : (
                <h1 className="nickname">{user.nickname}</h1>
              )}
              {user.profile_text && <p>{user.profile_text}</p>}
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
