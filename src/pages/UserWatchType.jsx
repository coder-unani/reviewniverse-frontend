import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useWatchTypeCreate } from "/src/hooks/useWatchTypeCreate";
import { showSuccessToast, showInfoToast } from "/src/components/Toast";
import { USER_WATCH_TYPE } from "/src/config/codes";
import { isEmpty } from "lodash";

const UserFavorite = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const { mutate: watchTypeCreate, isPending } = useWatchTypeCreate();

  const handleFavorite = (id) => {
    if (selectedFavorites.length >= 3 && !selectedFavorites.includes(id)) {
      showInfoToast("3개까지 선택 가능합니다.");
      return;
    }
    setSelectedFavorites((prev) => {
      const isSelected = prev.includes(id);

      if (isSelected) {
        return prev.filter((favoriteId) => favoriteId !== id);
      }

      return [...prev, id];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPending) {
      return;
    }
    if (isEmpty(selectedFavorites)) {
      // showErrorToast("1개 이상 선택해주세요.");
      return;
    }
    const watchType = selectedFavorites.join(",");
    await watchTypeCreate({ userId: user.id, watchType }),
      {
        onSuccess: (res) => {
          if (res.status === 201) {
            navigate("/");
            showSuccessToast("회원성향이 등록되었습니다.");
          }
        },
      };
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
                <button
                  type="button"
                  className="check"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(watchtype.id);
                  }}
                >
                  <img src="/assets/check.svg" alt="체크" />
                </button>
              </section>
            ))}
          </div>
          <button type="submit" disabled={isEmpty(selectedFavorites) || isPending}>
            완료
          </button>
        </form>
      </div>
    </main>
  );
};

export default UserFavorite;
