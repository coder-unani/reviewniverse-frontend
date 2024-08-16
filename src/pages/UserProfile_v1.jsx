import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordCheckForm from "/src/components/PasswordCheckForm";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import HttpClient from "/src/utils/HttpClient";
import { isEmpty } from "lodash";
import { formatUser } from "/src/utils/formatUser";
import { RiImageEditFill } from "@remixicon/react";
import { DEFAULT_IMAGES } from "/src/config/constants";
import "/src/styles/UserProfile.css";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.reviewniverse.net/v1";

/**
 * TODO:
 * 이메일 인증 여부 표시
 * 이메일 인증 기능 추가
 */

const UserProfile = () => {
  const navigate = useNavigate();
  // 비밀번호 확인 상태
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [previewImage, setPreviewImage] = useState(user?.profile_image || DEFAULT_IMAGES.noProfile);

  // 토큰 검증
  const tokenValidation = async () => {
    const access_token = sessionStorage.getItem("access_token");
    if (!access_token) return false;

    const client = new HttpClient(access_token);

    try {
      const res = await client.get(`${API_BASE_URL}/token`);
      if (res.status === 200) {
        return true;
      } else {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("access_token");
        setUser(null);
        return false;
      }
    } catch (error) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      setUser(null);
      return false;
    }
  };

  // 개인정보 수정 유효성 검사
  const EditSchema = (previousNickname) =>
    Yup.object()
      .shape({
        nickname: Yup.string()
          .test("nickname", "닉네임은 최소 2글자 이상입니다.", (val) => !val || val.length >= 2)
          .test("nickname", "닉네임은 최대 20글자입니다.", (val) => !val || val.length <= 20)
          .test(
            "nickname",
            "닉네임은 한글, 영문, 숫자만 입력 가능합니다.",
            (val) => !val || /^[a-zA-Z가-힣0-9]*$/.test(val)
          )
          .nullable(),
        profile_text: Yup.string().max(100, "소개는 최대 100자까지 입력 가능합니다.").nullable(),
        password_origin: Yup.string().nullable(),
        password_new: Yup.string().nullable(),
        is_marketing_agree: Yup.boolean().nullable(),
      })
      .test("passwords", "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.", function (value) {
        const { currentPassword, newPassword } = value;
        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
          return this.createError({
            path: "newPassword",
            message: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
          });
        }
        return true;
      });

  const defaultValues = {
    profile_image: DEFAULT_IMAGES.noProfile,
    nickname: "",
    password_origin: "",
    password_new: "",
    profile_text: "",
    is_marketing_agree: false,
  };

  const methods = useForm({
    resolver: yupResolver(EditSchema(user?.nickname)),
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
    const fieldsToCheck = [
      "profile_image",
      "nickname",
      "password_origin",
      "password_new",
      "profile_text",
      "is_marketing_agree",
    ];

    fieldsToCheck.forEach((field) => {
      if (
        data[field] === user[field] ||
        (!data[field] && data[field] !== false) ||
        (field === "profile_image" && data[field] === DEFAULT_IMAGES.noProfile)
      ) {
        delete updateData[field];
      }
    });

    // 비밀번호 필드 확인 및 API 호출
    const verifyCurrentPassword = async () => {
      // 현재 비밀번호와 새 비밀번호가 모두 입력되었을 경우
      // 현재 비밀번호가 맞는지 확인
      try {
        const client = new HttpClient();
        const res = await client.patch(`${API_BASE_URL}/users/${user.id}/password`, {
          password_origin: data.password_origin,
          password_new: data.password_new,
        });
        if (res.status !== 204) {
          setError("currentPassword", {
            type: "manual",
            message: "현재 비밀번호가 일치하지 않습니다.",
          });
          return false;
        }
        return true;
      } catch (error) {
        cError(error);
        return false;
      }
    };

    if (updateData.password_origin && updateData.password_new) {
      const isPasswordVerified = await verifyCurrentPassword();
      if (!isPasswordVerified) return;

      // password_origin 및 password_new를 updateData에서 제거
      delete updateData.password_origin;
      delete updateData.password_new;
    }

    // 프로필 수정 API 호출
    try {
      const profileClient = new HttpClient();
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const res = await profileClient.put(`${API_BASE_URL}/users/${user.id}`, updateData, headers);
      if (res.status === 200) {
        cLog("프로필이 수정되었습니다.");
        sessionStorage.setItem("user", JSON.stringify(formatUser(res.data.user)));
      } else {
        cLog("프로필 수정에 실패하였습니다.");
        return;
      }
    } catch (error) {
      cError(error);
      return;
    }
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
    tokenValidation().then((isValid) => {
      if (!isValid) {
        navigate("/user/login");
        return;
      }
    });

    setValue("profile_image", user.profile_image);
    setValue("nickname", user.nickname);
    setValue("profile_text", user.profile_text);
    setValue("is_marketing_agree", user.is_marketing_agree);

    trigger();
  }, []);

  // TODO: URL 변수화 필요
  // input 값 변경 시 유효성 검사
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "nickname") {
        trigger("nickname").then((isValid) => {
          if (value.nickname === user.nickname) return;
          if (isValid) {
            // 닉네임 중복 체크
            // TODO: 한글 입력시 글자가 완성되면 두번 호출되는 이슈 해결 필요
            const client = new HttpClient();
            client
              .get(`${API_BASE_URL}/validation/users/nickname`, {
                nickname: value.nickname,
              })
              .then((res) => {
                if (res.status === 204 && res.code === "VALID_NICK_SUCC") {
                  // 성공
                  // TODO: 존재하지 않는 닉네임일 경우 input check 표시
                  clearErrors("nickname");
                } else {
                  // 실패
                  // 존재하는 닉네임일 경우 에러 메시지 출력
                  setError("nickname", {
                    type: "manual",
                    message: "이미 사용중인 닉네임입니다.",
                  });
                }
              })
              .catch((error) => {
                cError(error);
                reset();
              });
          }
        });
      } else if (name === "password_origin" || name === "password_new") {
        trigger(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger, setError, clearErrors]);

  if (isEmpty(user)) return null;

  return (
    <main className="edit-main">
      <div className="edit-wrapper">
        {!isPasswordConfirmed ? (
          <PasswordCheckForm setIsPasswordConfirmed={setIsPasswordConfirmed} />
        ) : (
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
                  <RiImageEditFill size={24} />
                </label>
              </div>
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
            <div className="input-wrapper">
              <label htmlFor="password_origin">현재 비밀번호</label>
              <input type="password" id="password_origin" {...register("password_origin")} />
              {errors.password_origin && <p className="error">{errors.password_origin.message}</p>}
            </div>
            <div className="input-wrapper">
              <label htmlFor="password_new">새 비밀번호</label>
              <input type="password" id="password_new" {...register("password_new")} />
              {errors.password_new && <p className="error">{errors.password_new.message}</p>}
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
        )}
      </div>
    </main>
  );
};

export default UserProfile;
