import HttpClient from "/src/utils/HttpClient";
import { settings } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = settings.API_BASE_URL;
const endpoints = {
  screens: baseURL + "/v1/screens",
};

export const fetchScreenContents = async ({ code }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.screens, {
      code,
    });
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};
