import HttpClient from "/src/utils/HttpClient";
import { SETTINGS } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = SETTINGS.API_BASE_URL;
const endpoints = {
  login: baseURL + "/v1/users/login",
  join: baseURL + "/v1/users",
  users: baseURL + "/v1/users",
  user: baseURL + "/v1/users/:userId",
  userUpdate: baseURL + "/v1/users/:userId",
  validateEmail: baseURL + "/v1/users/validate/email",
  validateNickname: baseURL + "/v1/users/validate/nickname",
};

// 로그인
export const fetchLogin = async ({ user }) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.login, {
      code: user.code,
      email: user.email,
      ...(user.password && { password: user.password }),
      ...(user.sns_id && { sns_id: user.sns_id }),
    });
    return res;
  } catch (error) {
    cError(error);
  }
};

// 회원가입
export const fetchJoin = async (user) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.join, { ...user });
    return res;
  } catch (error) {
    cError(error);
  }
};

// 회원정보 조회
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
    client.setHeader({ "Content-Type": "multipart/form-data" });
    const res = await client.put(endpoints.userUpdate.replace(":userId", userId), updateData);
    return res;
  } catch (error) {
    cError(error);
  }
};

// 이메일 유효성 검사
export const fetchValidateEmail = async ({ email }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.validateEmail, { email });
    return res;
  } catch (error) {
    cError(error);
  }
};

// 닉네임 유효성 검사
export const fetchValidateNickname = async ({ nickname }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.validateNickname, { nickname });
    return res;
  } catch (error) {
    cError(error);
  }
};
