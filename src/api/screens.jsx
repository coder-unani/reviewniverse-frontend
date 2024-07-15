import HttpClient from "/src/utils/HttpClient";
import { settings } from "/src/config/settings";
import { cLog, cError } from "/src/utils/test";

export const fetchScreenContents = async ({ code }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(`${settings.API_BASE_URL}/v1/screens`, {
      code,
    });
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};
