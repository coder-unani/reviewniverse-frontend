import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useWatchTypeCreate } from "/src/hooks/useWatchTypeCreate";
import { USER_WATCH_TYPE } from "/src/config/codes";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";
import { isEmpty } from "lodash";

const UserFavorite = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [selectedFavorites, setSelectedFavorites] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(selectedFavorites)) {
      // showErrorToast("1개 이상 선택해주세요.");
      return;
    }
    const watchType = selectedFavorites.join(",");
    const res = await useWatchTypeCreate({ userId: user.id, watchType });
    if (res.status) {
      showSuccessToast(res.code);
      navigate("/");
    } else {
      showErrorToast(res.code);
    }
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
            {USER_WATCH_TYPE.map((watchtype) => (
              <section
                key={watchtype.id}
                className={`card ${selectedFavorites.includes(watchtype.id) ? "active" : ""}`}
                onClick={() => handleFavorite(watchtype.id)}
              >
                <div className="content">
                  <img src={watchtype.image} alt="취향 이미지" />
                  <p className="subtitle">{watchtype.subtitle}</p>
                  <p className="title">{watchtype.title}</p>
                </div>
                <button type="button" className="check" onClick={() => handleFavorite(watchtype.id)}>
                  <img src="/assets/check.svg" alt="체크" />
                </button>
              </section>
            ))}
          </div>
          <button type="submit" disabled={isEmpty(selectedFavorites)}>
            완료
          </button>
        </form>
      </div>
    </main>
  );
};

export default UserFavorite;
