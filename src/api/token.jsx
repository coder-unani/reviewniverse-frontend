import HttpClient from "/src/utils/HttpClient";
import { settings } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = settings.API_BASE_URL;
const endpoints = {
  token: baseURL + "/v1/token",
};

export const fetchToken = async () => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.token);
    return res.status === 200 ? true : false;
  } catch (error) {
    cError(error);
  }
};
