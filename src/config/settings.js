export const SETTINGS = {
  DEBUG: import.meta.env.VITE_DEBUG === "true",
  API_BASE_URL: "https://comet.reviewniverse.net",
  IMAGE_DOMAIN: "https://storage.reviewniverse.net/",
  IMAGE_RESIZE_R5: "r5",
  DEVICE_IDENTIFIER: import.meta.env.VITE_DEVICE_IDENTIFIER,
  DOMAIN_URL: import.meta.env.VITE_DOMAIN_URL,
  COOKIE_DOMAIN: import.meta.env.VITE_COOKIE_DOMAIN,
  ES_API_URL: import.meta.env.VITE_ES_API_URL,
  ES_API_KEY: import.meta.env.VITE_ES_API_KEY,
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  NAVER_CLIENT_ID: import.meta.env.VITE_NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: import.meta.env.VITE_NAVER_CLIENT_SECRET,
  NAVER_CALLBACK_URL: `${import.meta.env.VITE_DOMAIN_URL}/users/auth/naver/callback`,
  KAKAO_API_KEY: import.meta.env.VITE_KAKAO_API_KEY,
  KAKAO_CALLBACK_URL: `${import.meta.env.VITE_DOMAIN_URL}/users/auth/kakao/callback`,
};
