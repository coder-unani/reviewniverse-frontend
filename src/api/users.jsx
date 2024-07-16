import HttpClient from "/src/utils/HttpClient";
import { USER_CODE } from "/src/config/types";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

// User Token
export const fetchToken = async (token) => {
  try {
    const client = new HttpClient(token);
    const res = await client.post(`${API_BASE_URL}/token`);
    return res.status === 200;
  } catch (error) {
    cError(error);
  }
};

// 회원 로그인
export const fetchSnsUserSignIn = async ({ code, email, sns_id }) => {
  try {
    const response = await client.post(`${API_BASE_URL}/users/sns/signin`, {
      code,
      email,
      sns_id,
    });
    return response;
  } catch (error) {
    cError(error);
  }
};

export const fetchUserSignIn = async ({ email, password }) => {
  try {
    const response = await client.post(`${API_BASE_URL}/users/signin`, {
      code: "10",
      email,
      password,
    });
    return response;
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
    const response = await client.post(`${API_BASE_URL}/users`, {
      code,
      nickname,
      email,
      password,
      is_privacy_agree,
      is_terms_agree,
      is_age_agree,
      is_marketing_agree,
    });
    return response;
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
    const response = await client.post(`${API_BASE_URL}/users/sns/signup`, {
      code,
      nickname,
      email,
      sns_id,
      is_privacy_agree,
      is_terms_agree,
      is_age_agree,
      is_marketing_agree,
    });
    return response;
  } catch (error) {
    cError(error);
  }
};
