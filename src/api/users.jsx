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
  validationNickname: baseURL + "/v1/validation/users/nickname",
};

// 회원 로그인
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

// 회원 가입
export const fetchJoin = async (user) => {
  try {
    const client = new HttpClient();
    const res = await client.post(endpoints.join, { ...user });
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
    client.setHeader({ "Content-Type": "multipart/form-data" });
    const res = await client.put(endpoints.userUpdate.replace(":userId", userId), updateData);
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
