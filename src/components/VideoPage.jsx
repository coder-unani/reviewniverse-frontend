import React, { useEffect, useState } from "react";
import HVideos from "/src/components/HVideos";
import Videos from "/src/components/Videos";
import HttpClient from "/src/utils/HttpClient";
import { cLog, cError } from "/src/utils/test";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

const VideoPage = (props) => {
  const { id, type } = props;
  const [contents, setContents] = useState([]);

  const fetchData = async () => {
    try {
      const client = new HttpClient();
      const res = await client.get(`${API_BASE_URL}/screens`, {
        code: id,
      });
      if (res.status === 200) {
        setContents(res.data.data);
      }
    } catch (error) {
      cError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <main className="main">
      {contents.map((content, index) => (
        <HVideos key={index} content={content} />
      ))}
      <Videos {...(type && { type })} />
    </main>
  );
};

export default VideoPage;
