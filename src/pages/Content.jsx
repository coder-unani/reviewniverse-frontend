import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HttpClient from "/src/utils/HttpClient";
import { cLog, cError } from "/src/utils/test";

const Content = () => {
  const { contentId } = useParams();
  const [video, setVideo] = useState({});

  useEffect(() => {
    cLog(video);
  }, [video]);

  useEffect(() => {
    try {
      const client = new HttpClient();
      client
        .get(`https://comet.orbitcode.kr/v1/contents/videos/${contentId}`)
        .then((res) => {
          if (res.status === 200 && res.code === "VIDEO_READ_SUCC") {
            setVideo(res.data.data);
          } else {
            cLog("콘텐츠를 불러오는데 실패하였습니다.");
            return;
          }
        });
    } catch (error) {
      cError(error);
    }
  }, []);

  return <div>Content {contentId}</div>;
};

export default Content;
