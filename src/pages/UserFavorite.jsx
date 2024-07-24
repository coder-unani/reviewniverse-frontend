import React, { useEffect } from "react";
import "/src/styles/UserFavorite.css";

const UserFavorite = () => {
  return (
    <main className="favorite-main">
      <div className="favorite-wrapper">
        <form className="favorite-form" encType="multipart/form-data">
          <section className="card">
            <div className="content">
              <img src="/assets/favorite-1.png" alt="취향 이미지" />
              <p className="subtitle">언빌리버블</p>
              <p className="title">소름돋는 연기력</p>
            </div>
            <button type="button">
              <img src="/assets/check.svg" alt="체크" />
            </button>
          </section>
          <section className="card">
            <div className="content">
              <img src="/assets/favorite-2.png" alt="취향 이미지" />
              <p className="subtitle">우오아아</p>
              <p className="title">화려한 영상미</p>
            </div>
            <button type="button">
              <img src="/assets/check.svg" alt="체크" />
            </button>
          </section>
          <section className="card">
            <div className="content">
              <img src="/assets/favorite-1.png" alt="취향 이미지" />
              <p className="subtitle">저게 저렇게 된다고?</p>
              <p className="title">탄탄한 스토리</p>
            </div>
            <button type="button">
              <img src="/assets/check.svg" alt="체크" />
            </button>
          </section>
          <section className="card">
            <div className="content">
              <img src="/assets/favorite-1.png" alt="취향 이미지" />
              <p className="subtitle">너 임마</p>
              <p className="title">감독연출</p>
            </div>
            <button type="button">
              <img src="/assets/check.svg" alt="체크" />
            </button>
          </section>
          <section className="card">
            <div className="content">
              <img src="/assets/favorite-1.png" alt="취향 이미지" />
              <p className="subtitle">내 고막 어딨어</p>
              <p className="title">고막 녹아 OST</p>
            </div>
            <button type="button">
              <img src="/assets/check.svg" alt="체크" />
            </button>
          </section>
          <section className="card">
            <div className="content">
              <img src="/assets/favorite-1.png" alt="취향 이미지" />
              <p className="subtitle">걔도?쟤도?</p>
              <p className="title">초호화 캐스팅</p>
            </div>
            <button type="button">
              <img src="/assets/check.svg" alt="체크" />
            </button>
          </section>
        </form>
      </div>
    </main>
  );
};

export default UserFavorite;
