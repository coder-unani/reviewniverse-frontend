import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useUserUpdate } from "/src/hooks/useUserUpdate";
import { useValidateNickname } from "/src/hooks/useValidateNickname";
import { showSuccessToast, showErrorToast } from "/src/components/Toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { useUserMe } from "/src/hooks/useUserMe";
import {
  DEFAULT_IMAGES,
  PROFILE_IMAGE_FILE_SIZE,
  PROFILE_IMAGE_FILE_TYPE,
  PROFILE_TEXT_MAX_LENGTH,
} from "/src/config/constants";
import { EndpointManager, ENDPOINTS } from "/src/config/endpoints";
import { isValidFileSize, isValidFileType } from "/src/utils/validation";
import { isEmpty } from "lodash";
import ImageIcon from "/src/assets/button/outline-image.svg?react";

/**
 * TODO:
 * 이메일 인증 여부 표시
 * 이메일 인증 기능 추가
 */

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { mutateAsync: userMe, isPending: isUserPending, isSuccess: isUserSuccess, isError: isUserError } = useUserMe();
  const { mutateAsync: validateNickname, isPending: isValidatePending } = useValidateNickname();
  const { mutate: userUpdate, isPending: isUpdatePending } = useUserUpdate();

  // 유효성 검사 스키마
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

  // 폼 초기값
  const defaultValues = {
    profile_image: DEFAULT_IMAGES.noActor,
    nickname: "",
    profile_text: "",
    is_marketing_agree: false,
  };

  // 폼 메소드
  const methods = useForm({
    resolver: yupResolver(EditSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // 폼 메소드 분해
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

  const watchNickname = useWatch({ control, name: "nickname" });
  const watchIntroduction = useWatch({ control, name: "profile_text", defaultValue: "" });

  // 유저 정보 수정 요청
  // TODO: 프로필 소개 길이 확인 필요
  const onSubmit = handleSubmit(async (data) => {
    if (isValidatePending || isUpdatePending) {
      return;
    }

    const nicknameValid = await trigger("nickname");
    if (nicknameValid && profile.nickname !== data.nickname) {
      const nicknameRes = await validateNickname({ nickname: data.nickname });

      if (nicknameRes.status === 200) {
        if (nicknameRes.data) {
          clearErrors("nickname");
        } else {
          setError("nickname", {
            type: "manual",
            message: "이미 사용중인 닉네임입니다.",
          });
          return;
        }
      } else {
        return;
      }
    }

    const updateData = {};
    const fieldsCheck = ["profile_image", "nickname", "profile_text", "is_marketing_agree"];

    fieldsCheck.forEach((field) => {
      if (data[field] !== profile[field]) {
        if (field === "profile_image" && data[field] === DEFAULT_IMAGES.noActor) return;
        if (field === "profile_text" && !data[field] && profile[field] === null) return;
        updateData[field] = data[field];
      }
    });
    if (isEmpty(updateData)) {
      const path = EndpointManager.generateUrl(ENDPOINTS.USER, { userId: profile.id });
      navigate(path);
      showSuccessToast("프로필이 수정되었습니다.");
      return;
    }

    await userUpdate(
      { userId: profile.id, updateData },
      {
        onSuccess: (res) => {
          if (res.status === 204) {
            const path = EndpointManager.generateUrl(ENDPOINTS.USER, { userId: profile.id });
            navigate(path, { state: { isUserUpdate: true } });
            showSuccessToast("프로필이 수정되었습니다.");
          } else {
            showErrorToast("프로필을 수정하지 못했습니다.");
          }
        },
        onError: () => {
          showErrorToast("프로필을 수정하지 못했습니다.");
        },
      }
    );
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

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const me = await userMe();
      if (me.status) {
        // 요청한 유저 아이디와 로그인한 유저 아이디가 다르다면 404페이지로 이동
        if (me.data.id !== user.id) {
          return navigate(ENDPOINTS.NOT_FOUND);
        }

        setProfile(me.data);
        setPreviewImage(me.data.profile_image || DEFAULT_IMAGES.noActor);
      }
    };

    fetchData();
  }, [userMe]);

  // 유저 정보 세팅
  useEffect(() => {
    if (!profile) {
      return;
    }

    setValue("profile_image", profile.profile_image);
    setValue("nickname", profile.nickname);
    setValue("profile_text", profile.profile_text || "");
    setValue("is_marketing_agree", profile.is_marketing_agree);
  }, [profile, setValue]);

  // 유저 닉네임 변경 시 유효성 검사
  useEffect(() => {
    if (watchNickname) {
      trigger("nickname");
    }
  }, [watchNickname, trigger]);

  // 유저 소개글 길이 제한
  useEffect(() => {
    if (watchIntroduction.length > PROFILE_TEXT_MAX_LENGTH) {
      setValue("profile_text", watchIntroduction.slice(0, PROFILE_TEXT_MAX_LENGTH));
    }
  }, [watchIntroduction, setValue]);

  // 로그인한 유저가 없다면 로그인 페이지로 이동
  if (!user) {
    return navigate(ENDPOINTS.USER_LOGIN);
  }

  // 유저 정보 조회 중이라면 null 반환
  if (isUserPending) {
    return null;
  }

  // 유저 정보 조회 실패 시 에러 페이지로 이동
  if (isUserError) {
    return navigate(ENDPOINTS.ERROR);
  }

  // 유저 정보가 없다면 null 반환
  if (isEmpty(profile) || isUserPending) {
    return null;
  }

  return (
    <main className="edit-main">
      <div className="edit-wrapper">
        <form method={methods} onSubmit={onSubmit} className="edit-form" encType="multipart/form-data">
          <div className="input-wrapper image">
            <div className="profile-image edit">
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
                <ImageIcon />
              </label>
            </div>
            {errors.profile_image && <p className="error">{errors.profile_image.message}</p>}
          </div>
          <div className="input-wrapper email">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" value={profile.email} readOnly />
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
          <button type="submit" disabled={!isDirty || !isValid || isValidatePending || isUpdatePending}>
            수정하기
          </button>
        </form>
      </div>
    </main>
  );
};

export default UserProfile;
