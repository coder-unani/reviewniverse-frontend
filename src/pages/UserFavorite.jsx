import React, { useState, useCallback } from "react";
import "/src/styles/UserFavorite.css";

const favorites = [
  {
    id: 1,
    title: "소름돋는 연기력",
    subtitle: "언빌리버블",
    image: "/assets/favorite-1.png",
  },
  {
    id: 2,
    title: "화려한 영상미",
    subtitle: "눈호강",
    image: "/assets/favorite-2.png",
  },
  {
    id: 3,
    title: "탄탄한 스토리",
    subtitle: "저게 저렇게 된다고?",
    image: "/assets/favorite-1.png",
  },
  {
    id: 4,
    title: "감독연출",
    subtitle: "기가맥힘",
    image: "/assets/favorite-1.png",
  },
  {
    id: 5,
    title: "고막 녹는 OST",
    subtitle: "본격 귀호강",
    image: "/assets/favorite-1.png",
  },
  {
    id: 6,
    title: "초호화 캐스팅",
    subtitle: "걔도?쟤도?",
    image: "/assets/favorite-1.png",
  },
];

const UserFavorite = () => {
  // 선택한 취향
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  // };

  const handleFavorite = useCallback((id) => {
    setSelectedFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favoriteId) => favoriteId !== id);
      } else if (prev.length < 3) {
        // 일단 3개까지만
        return [...prev, id];
      }
      return prev;
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedFavorites);
  };

  return (
    <main className="favorite-main">
      <div className="favorite-wrapper">
        <form className="favorite-form" onSubmit={handleSubmit}>
          <h2>회원님의 취향을 선택해주세요.👀</h2>
          <p>
            <em>3개</em>까지 선택 가능합니다.
          </p>
          <div className="favorite-content">
            {favorites.map((favorite) => (
              <section
                key={favorite.id}
                className={`card ${selectedFavorites.includes(favorite.id) ? "active" : ""}`}
                onClick={() => handleFavorite(favorite.id)}
              >
                <div className="content">
                  <img src={favorite.image} alt="취향 이미지" />
                  <p className="subtitle">{favorite.subtitle}</p>
                  <p className="title">{favorite.title}</p>
                </div>
                <button type="button" className="check">
                  <img src="/assets/check.svg" alt="체크" />
                </button>
              </section>
            ))}
          </div>
          <button type="submit">완료</button>
        </form>
      </div>
    </main>
  );
};

export default UserFavorite;
