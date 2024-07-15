import HttpClient from "/src/utils/HttpClient";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

export const fetchScreenContents = async ({ code }) => {
  try {
    const client = new HttpClient();
    const res = await client.get(`${API_BASE_URL}/screens`, {
      code,
    });
    return res.status === 200 ? res.data : [];
  } catch (error) {
    cError(error);
  }
};
