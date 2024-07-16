import HttpClient from "/src/utils/HttpClient";
import { settings } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = settings.API_BASE_URL;
const endpoints = {
  signin: baseURL + "/v1/users/signin",
  snsSignin: baseURL + "/v1/users/sns/signin",
  signup: baseURL + "/v1/users",
  snsSignup: baseURL + "/v1/users/sns/signup",
};

// 회원 로그인
export const fetchSignIn = async ({ email, password }) => {
  try {
    const response = await client.post(endpoints.signin, {
      code: "10",
      email,
      password,
    });
    return response;
  } catch (error) {
    cError(error);
  }
};

export const fetchSnsSignIn = async ({ code, email, sns_id }) => {
  try {
    const response = await client.post(endpoints.snsSignin, {
      code,
      email,
      sns_id,
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
    const response = await client.post(endpoints.signup, {
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
    const response = await client.post(endpoints.snsSignup, {
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
