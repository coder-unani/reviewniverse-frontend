import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideoDetail } from "/src/hooks/useVideoDetail";
import { useVideoMyInfo } from "/src/hooks/useVideoMyInfo";
import { fParseInt } from "/src/utils/format";
import { ENDPOINTS } from "/src/config/endpoints";

const VideoDetailContext = createContext();

export const VideoDetailProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { videoId } = useParams();
  const videoId2Int = fParseInt(videoId);
  const {
    data: content,
    error: contentError,
    isLoading: contentIsLoading,
  } = useVideoDetail({ videoId: videoId2Int, enabled: videoId2Int });
  const {
    data: myInfo,
    error: myInfoError,
    isLoading: myInfoIsLoading,
  } = useVideoMyInfo({ videoId: videoId2Int, userId: user ? user.id : null, enabled: user && videoId2Int });

  // 비디오 ID가 숫자형이 아닐 경우 404 페이지로 이동
  useEffect(() => {
    if (videoId2Int === 0) {
      return navigate(ENDPOINTS.NOT_FOUND);
    }
  }, [videoId2Int, navigate]);

  // 비디오 에러 발생 시 404 or 에러 페이지로 이동
  useEffect(() => {
    if (contentIsLoading) {
      return;
    }
    if (contentError) {
      // VIDEO_NOT_FOUND일 시 404 페이지로 이동
      if (contentError.message === "C003") {
        return navigate(ENDPOINTS.NOT_FOUND);
      } else {
        return navigate(ENDPOINTS.ERROR);
      }
    }
  }, [contentIsLoading, contentError, navigate]);

  // 내 정보 에러 발생 시 에러 무시
  useEffect(() => {
    // if (myInfoError) {
    //   return navigate(ENDPOINTS.ERROR);
    // }
  }, [myInfoError, navigate]);

  const values = useMemo(
    () => ({
      videoId: videoId2Int,
      content,
      contentIsLoading,
      contentError,
      myInfo,
      myInfoIsLoading,
      myInfoError,
    }),
    [videoId2Int, content, contentIsLoading, contentError, myInfo, myInfoIsLoading, myInfoError]
  );

  return <VideoDetailContext.Provider value={values}>{children}</VideoDetailContext.Provider>;
};

export const useVideoDetailContext = () => {
  const context = useContext(VideoDetailContext);
  if (!context) {
    throw new Error("useVideoDetailContext must be used within a VideoDetailProvider");
  }
  return context;
};
