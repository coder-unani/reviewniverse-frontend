import React, { useMemo } from "react";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { isEmpty } from "lodash";

const VideoSectionSynopsis = React.memo(() => {
  const { content } = useVideoDetailContext();
  const synopsis = useMemo(() => content.data.synopsis, [content.data.synopsis]);

  const renderSynopsis = () => (
    <section className="detail-synopsis-section">
      <h4 className="detail-main-title">작품 소개</h4>
      <summary className="detail-synopsis">{synopsis}</summary>
    </section>
  );

  return isEmpty(synopsis) ? null : renderSynopsis();
});

export default VideoSectionSynopsis;
