import React from "react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/UserDelete.css";
import { cLog } from "/src/utils/test";

const UserDelete = () => {
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
          <button type="submit">탈퇴 하기</button>
        </form>
      </div>
    </main>
  );
};

export default UserDelete;
