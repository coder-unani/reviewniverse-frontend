import HttpClient from "/src/utils/HttpClient";
import { SETTINGS } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = SETTINGS.API_BASE_URL;
const endpoints = {
  screens: baseURL + "/v1/screens",
};

export const fetchScreenVideos = async ({ code }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.screens, { code });
    return res;
  } catch (error) {
    cError(error);
  }
};
