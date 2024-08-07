import axios from "axios";
import { getStorageAccessToken } from "/src/utils/formatStorage";
import { SETTINGS } from "/src/config/settings";

class HttpClient {
  client = null;

  constructor(token = null) {
    this.client = axios.create();
    this.client.defaults.headers.common["Content-Type"] = "application/json";
    this.client.defaults.headers.common["Accept"] = "application/json";
    // this.client.defaults.headers.common["X-Device-Identifier"] = SETTINGS.DEVICE_IDENTIFIER;
    if (!token && getStorageAccessToken()) {
      token = getStorageAccessToken();
    }
    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  setHeader(headers) {
    Object.assign(this.client.defaults.headers.common, headers);
  }

  async get(url, data = null) {
    try {
      return await this.client
        .get(url, { params: data ? data : {} })
        .then((response) => {
          return this.responseHandler(response);
        })
        .catch((reason) => {
          return this.errorHandler(reason);
        });
    } catch (reason) {
      return this.errorHandler(reason);
    }
  }

  async post(url, data = null, params = null) {
    try {
      return await this.client
        .post(url, data ? data : {}, params ? { params } : {})
        .then((response) => {
          return this.responseHandler(response);
        })
        .catch((reason) => {
          return this.errorHandler(reason);
        });
    } catch (reason) {
      return this.errorHandler(reason);
    }
  }

  async put(url, data = null) {
    try {
      return await this.client
        .put(url, data ? data : {})
        .then((response) => {
          return this.responseHandler(response);
        })
        .catch((reason) => {
          return this.errorHandler(reason);
        });
    } catch (reason) {
      return this.errorHandler(reason);
    }
  }

  async delete(url, data = null) {
    try {
      return await this.client
        .delete(url, data ? data : {})
        .then((response) => {
          return this.responseHandler(response);
        })
        .catch((reason) => {
          return this.errorHandler(reason);
        });
    } catch (reason) {
      return this.errorHandler(reason);
    }
  }

  async patch(url, data = null) {
    try {
      return await this.client
        .patch(url, data ? data : {})
        .then((response) => {
          return this.responseHandler(response);
        })
        .catch((reason) => {
          return this.errorHandler(reason);
        });
    } catch (reason) {
      return this.errorHandler(reason);
    }
  }

  responseHandler(response) {
    return {
      status: response.status,
      code: response.headers.code,
      message: response.data?.message,
      data: response.data,
    };
  }

  errorHandler(reason) {
    if (axios.isAxiosError(reason)) {
      return {
        status: reason.response?.status,
        code: reason.code,
        message: reason.response?.data,
      };
    } else {
      return {
        status: 500,
        message: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      };
    }
  }
}

export default HttpClient;
