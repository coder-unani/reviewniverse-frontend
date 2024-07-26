import React from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/UserDelete.css";
import { cLog } from "/src/utils/test";

const UserDelete = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    // 이전 페이지로 이동
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    cLog("탈퇴하기");
  };

  return (
    <main className="delete-main">
      <div className="delete-wrapper">
        <form className="delete-form" onSubmit={handleSubmit}>
          <p className="title">정말 탈퇴하시겠어요?</p>
          <p className="sub-title">
            삭제된 계정은 복구할 수 없습니다.
            <br />
            삭제하시려면 아래의 버튼을 눌러주세요.
          </p>
          <img src={DEFAULT_IMAGES.userDelete} alt="회원 탈퇴 이미지" />
          <div className="button-wrapper">
            <button type="button" className="cancel" onClick={handleCancel}>
              안할래요!
            </button>
            <button type="button" className="delete">
              탈퇴하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UserDelete;
