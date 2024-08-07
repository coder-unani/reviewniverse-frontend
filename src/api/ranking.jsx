import HttpClient from "/src/utils/HttpClient";
import { SETTINGS } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

const baseURL = SETTINGS.API_BASE_URL;
const endpoints = {
  ranking: baseURL + "/v1/ranking/videos",
};

export const fetchRanking = async ({ code, count }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(endpoints.ranking, { code, count });
    return res;
  } catch (error) {
    cError(error);
  }
};
