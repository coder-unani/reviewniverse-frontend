import React, { useEffect, useState } from "react";
import { useAuthContext } from "/src/context/AuthContext";
import { fetchValidationNickname } from "/src/api/users";
import { useUserUpdate } from "/src/hooks/useUserUpdate";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { RiImageEditFill } from "@remixicon/react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import { isEmpty } from "lodash";
import "/src/styles/UserProfile.css";

/**
 * TODO:
 * 소개글 200자 제한
 * 이메일 인증 여부 표시
 * 이메일 인증 기능 추가
 */

const UserProfile = () => {
  const { user } = useAuthContext();
  const [previewImage, setPreviewImage] = useState(user?.profile_image || DEFAULT_IMAGES.noProfile);
  const { mutate: userUpdate } = useUserUpdate();

  // 개인정보 수정 유효성 검사
  const EditSchema = Yup.object().shape({
    nickname: Yup.string()
      .min(2, "닉네임은 최소 2글자 이상입니다.")
      .max(20, "닉네임은 최대 20글자입니다.")
      .matches(/^[a-zA-Z가-힣0-9]*$/, "닉네임은 한글, 영문, 숫자만 입력 가능합니다.")
      .required("닉네임을 입력해주세요."),
    profile_text: Yup.string().max(100, "소개는 최대 100자까지 입력 가능합니다.").nullable(),
    is_marketing_agree: Yup.boolean().nullable(),
  });

  const defaultValues = {
    profile_image: DEFAULT_IMAGES.noProfile,
    nickname: "",
    profile_text: "",
    is_marketing_agree: false,
  };

  const methods = useForm({
    resolver: yupResolver(EditSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isDirty, isValid },
    reset,
    trigger,
  } = methods;

  const watchIntroduction = useWatch({ control, name: "profile_text", defaultValue: "" });

  const onSubmit = handleSubmit(async (data) => {
    const updateData = { ...data };

    // 중복되지 않은 데이터만 추출
    const fieldsToCheck = ["profile_image", "nickname", "profile_text", "is_marketing_agree"];

    fieldsToCheck.forEach((field) => {
      if (
        data[field] === user[field] ||
        (!data[field] && data[field] !== false) ||
        (field === "profile_image" && data[field] === DEFAULT_IMAGES.noProfile)
      ) {
        delete updateData[field];
      }
    });

    if (isEmpty(updateData)) return;

    userUpdate({ userId: user.id, updateData });
  });

  // 프로필 이미지 교체
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기와 형식 유효성 검사
    const validFileSize = file.size <= 31457280; // 30MB
    const validFileType = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type);
    if (!validFileSize) {
      setError("profile_image", { type: "manual", message: "이미지 파일은 30MB 이하만 가능합니다." });
      return;
    }
    if (!validFileType) {
      setError("profile_image", { type: "manual", message: "이미지 파일 형식만 가능합니다." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    // useForm의 setValue를 사용하여 profileImage 필드를 업데이트
    setValue("profile_image", file, { shouldValidate: true, shouldDirty: true });
    clearErrors("profile_image");
  };

  useEffect(() => {
    // 로그인한 유저가 없을 경우 로그인 페이지로 이동
    if (!user) {
      window.location.href = "/user/login";
      return;
    }

    setValue("profile_image", user.profile_image);
    setValue("nickname", user.nickname);
    setValue("profile_text", user.profile_text || "");
    setValue("is_marketing_agree", user.is_marketing_agree);

    trigger();
  }, []);

  // TODO: URL 변수화 필요
  // input 값 변경 시 유효성 검사
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "nickname") {
        if (value.nickname === user.nickname) return;
        trigger("nickname").then(async (isValid) => {
          if (isValid) {
            // 닉네임 중복 체크
            // TODO: 한글 입력시 글자가 완성되면 두번 호출되는 이슈 해결 필요
            const res = await fetchValidationNickname({ nickname: value.nickname });
            if (res === "VALID_NICK_SUCC") {
              clearErrors("nickname");
            } else if (res === "VALID_NICK_EXIST") {
              // 실패: 존재하는 닉네임일 경우 에러 메시지 출력
              setError("nickname", {
                type: "manual",
                message: "이미 사용중인 닉네임입니다.",
              });
            }
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger, setError, clearErrors]);

  if (isEmpty(user)) return null;

  return (
    <main className="edit-main">
      <div className="edit-wrapper">
        <form method={methods} onSubmit={onSubmit} className="edit-form" encType="multipart/form-data">
          <div className="input-wrapper image">
            <figure className="profile-image edit">
              <img src={previewImage} alt="프로필 이미지" />
              <input
                type="file"
                id="profile_image"
                name="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="profile_image">
                <RiImageEditFill size={24} />
              </label>
            </figure>
            {errors.profile_image && <p className="error">{errors.profile_image.message}</p>}
          </div>
          <div className="input-wrapper">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" value={user.email} readOnly />
          </div>
          <div className="input-wrapper">
            <label htmlFor="nickname">닉네임</label>
            <input type="text" id="nickname" spellCheck="false" {...register("nickname")} />
            {errors.nickname && <p className="error">{errors.nickname.message}</p>}
          </div>
          <div className="input-wrapper introduction">
            <label htmlFor="profile_text">
              <span>소개</span>
              <span>{watchIntroduction.length} / 100</span>
            </label>
            <textarea
              id="profile_text"
              placeholder="소개글을 입력하세요."
              spellCheck="false"
              {...register("profile_text")}
            />
            {errors.profile_text && <p className="error">{errors.profile_text.message}</p>}
          </div>
          <div className="input-wrapper marketing">
            <input type="checkbox" id="is_marketing_agree" {...register("is_marketing_agree")} />
            <label htmlFor="is_marketing_agree">마케팅 정보 수신 동의</label>
          </div>
          <button type="submit" disabled={!isDirty}>
            수정하기
          </button>
        </form>
      </div>
    </main>
  );
};

export default UserProfile;
