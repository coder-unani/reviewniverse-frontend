import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useUserDelete } from "/src/hooks/useUserDelete";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";
import { DEFAULT_IMAGES } from "/src/config/constants";

const UserDelete = () => {
  const navigate = useNavigate();
  const { user, handleRemoveUser } = useAuthContext();
  const { mutate: userDelete, isPending: isDeletePending } = useUserDelete();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (isDeletePending) {
      return;
    }
    await userDelete(
      { userId: user.id },
      {
        onSuccess: (res) => {
          if (res.status === 204) {
            handleRemoveUser();
            navigate("/");
            showSuccessToast("회원탈퇴가 완료되었습니다.");
          } else {
            showErrorToast("회원탈퇴를 완료하지 못했습니다.");
          }
        },
      },
      {
        onError: () => {
          showErrorToast("회원탈퇴를 완료하지 못했습니다.");
        },
      }
    );
  };

  return (
    <main className="delete-main">
      <div className="delete-wrapper">
        <div className="delete-form">
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
            <button type="button" className="delete" onClick={handleDelete} disabled={isDeletePending}>
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDelete;
