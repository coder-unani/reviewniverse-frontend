import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "/src/context/AuthContext";
import { useVideoDetail } from "/src/hooks/useVideoDetail";
import { useVideoMyInfo } from "/src/hooks/useVideoMyInfo";
import { fParseInt } from "/src/utils/format";

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

  useEffect(() => {
    if (videoId2Int === 0) {
      return navigate("/404-not-found");
    }
  }, [videoId2Int, navigate]);

  useEffect(() => {
    if (!content) {
      return;
    }
    if (!content.status) {
      const path = content.code === "V002" ? "/404-not-found" : "/error";
      navigate(path);
    }
  }, [content, navigate]);

  useEffect(() => {
    if (contentError || myInfoError) {
      navigate("/error");
    }
  }, [contentError, myInfoError, navigate]);

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
