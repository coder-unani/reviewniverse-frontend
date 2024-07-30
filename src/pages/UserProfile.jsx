import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useUserUpdate } from "/src/hooks/useUserUpdate";
import { useValidateNickname } from "/src/hooks/useValidateNickname";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { isEmpty } from "lodash";
import {
  DEFAULT_IMAGES,
  PROFILE_IMAGE_FILE_SIZE,
  PROFILE_IMAGE_FILE_TYPE,
  PROFILE_TEXT_MAX_LENGTH,
} from "/src/config/constants";
import { isValidFileSize, isValidFileType } from "/src/utils/validation";
import { RiImageEditFill } from "@remixicon/react";
import "/src/styles/UserProfile.css";

/**
 * TODO:
 * 이메일 인증 여부 표시
 * 이메일 인증 기능 추가
 */

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [previewImage, setPreviewImage] = useState(user?.profile_image || DEFAULT_IMAGES.noProfile);

  // 개인정보 수정 유효성 검사
  const EditSchema = Yup.object().shape({
    nickname: Yup.string()
      .min(2, "닉네임은 최소 2글자 이상입니다.")
      .max(20, "닉네임은 최대 20글자입니다.")
      .matches(/^[a-zA-Z가-힣0-9]*$/, "닉네임은 한글, 영문, 숫자만 입력 가능합니다.")
      .required("닉네임을 입력해주세요."),
    profile_text: Yup.string()
      .max(PROFILE_TEXT_MAX_LENGTH, `소개는 최대 ${PROFILE_TEXT_MAX_LENGTH}자까지 입력 가능합니다.`)
      .nullable(),
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
    formState: { errors, isDirty, isValid },
    trigger,
  } = methods;

  const watchIntroduction = useWatch({ control, name: "profile_text", defaultValue: "" });

  // TODO: 프로필 소개 길이 확인 필요
  const onSubmit = handleSubmit(async (data) => {
    const nicknameValid = await trigger("nickname");
    if (nicknameValid && user.nickname !== data.nickname) {
      const nicknameRes = await useValidateNickname({ nickname: data.nickname });
      if (!nicknameRes.status) {
        setError("nickname", {
          type: "manual",
          message: nicknameRes.code,
        });
        return;
      }
    }

    const updateData = { ...data };
    const fieldsCheck = ["profile_image", "nickname", "profile_text", "is_marketing_agree"];
    fieldsCheck.forEach((field) => {
      if (data[field] === user[field] || (field === "profile_image" && data[field] === DEFAULT_IMAGES.noProfile)) {
        delete updateData[field];
      }
    });
    if (isEmpty(updateData)) return;

    const res = await useUserUpdate({ userId: user.id, updateData });
    if (res.status) {
      showSuccessToast(res.code);
      navigate(`/user/${user.id}`, { state: { isUserUpdate: res.status } });
    } else {
      showErrorToast(res.code);
    }
  });

  // 프로필 이미지 교체
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기와 형식 유효성 검사
    const validFileType = isValidFileType(file, PROFILE_IMAGE_FILE_TYPE);
    const validFileSize = isValidFileSize(file, PROFILE_IMAGE_FILE_SIZE);
    if (!validFileType) {
      setError("profile_image", {
        type: "manual",
        message: `이미지 파일 형식만 가능합니다.`,
      });
      return;
    }
    if (!validFileSize) {
      setError("profile_image", {
        type: "manual",
        message: `이미지 파일은 ${PROFILE_IMAGE_FILE_SIZE}MB 이하만 가능합니다.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setValue("profile_image", file, { shouldValidate: true, shouldDirty: true });
    clearErrors("profile_image");
  };

  useEffect(() => {
    setValue("profile_image", user.profile_image);
    setValue("nickname", user.nickname);
    setValue("profile_text", user.profile_text || "");
    setValue("is_marketing_agree", user.is_marketing_agree);
    trigger();
  }, []);

  useEffect(() => {
    if (watchIntroduction.length > PROFILE_TEXT_MAX_LENGTH) {
      setValue("profile_text", watchIntroduction.slice(0, PROFILE_TEXT_MAX_LENGTH));
    }
  }, [watchIntroduction, setValue]);

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
              <span>
                {watchIntroduction.length} / {PROFILE_TEXT_MAX_LENGTH}
              </span>
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
