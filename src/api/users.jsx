import HttpClient from "/src/utils/HttpClient";
import { settings } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = settings.API_BASE_URL;
const endpoints = {
  signin: baseURL + "/v1/users/signin",
  snsSignin: baseURL + "/v1/users/sns/signin",
  signup: baseURL + "/v1/users",
  snsSignup: baseURL + "/v1/users/sns/signup",
  users: baseURL + "/v1/users",
  user: baseURL + "/v1/users/:userId",
  userUpdate: baseURL + "/v1/users/:userId",
  validationNickname: baseURL + "/v1/validation/users/nickname",
};

// 회원 로그인
export const fetchSignIn = async ({ email, password }) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.signin, {
      code: "10",
      email,
      password,
    });
    return res;
  } catch (error) {
    cError(error);
  }
};

export const fetchSnsSignIn = async ({ code, email, sns_id }) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.snsSignin, {
      code,
      email,
      sns_id,
    });
    return res;
  } catch (error) {
    cError(error);
  }
};

// 회원 가입
export const fetchSignUp = async ({
  email,
  password,
  nickname,
  is_privacy_agree,
  is_terms_agree,
  is_age_agree,
  is_marketing_agree,
}) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.signup, {
      code,
      nickname,
      email,
      password,
      is_privacy_agree,
      is_terms_agree,
      is_age_agree,
      is_marketing_agree,
    });
    return res;
  } catch (error) {
    cError(error);
  }
};

export const fetchSnsSignUp = async ({
  code,
  email,
  sns_id,
  nickname,
  is_privacy_agree,
  is_terms_agree,
  is_age_agree,
  is_marketing_agree,
}) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.snsSignup, {
      code,
      nickname,
      email,
      sns_id,
      is_privacy_agree,
      is_terms_agree,
      is_age_agree,
      is_marketing_agree,
    });
    return res;
  } catch (error) {
    cError(error);
  }
};

export const fetchUsers = async ({ userId }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.users, { uid: userId });
    return res;
  } catch (error) {
    cError(error);
  }
};

// 회원정보 가져오기
export const fetchUser = async ({ userId }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.user.replace(":userId", userId));
    return res;
  } catch (error) {
    cError(error);
  }
};

// 회원정보 수정
export const fetchUserUpdate = async ({ userId, updateData }) => {
  try {
    const client = new HttpClient();
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const res = await client.put(endpoints.userUpdate.replace(":userId", userId), updateData, headers);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};

// 닉네임 중복 체크
export const fetchValidationNickname = async ({ nickname }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.validationNickname, { nickname });
    return res.status === 204 ? res.code : "";
  } catch (error) {
    cError(error);
  }
};
