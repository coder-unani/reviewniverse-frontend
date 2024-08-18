import React from "react";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { isEmpty } from "lodash";
import { fPlatformFilter } from "/src/utils/formatContent";

const VideoSectionPlatform = React.memo(() => {
  const { content } = useVideoDetailContext();
  const platforms = fPlatformFilter(content.data.platform);

  const renderPlatform = () => (
    <section className="detail-platform-section">
      <h4 className="detail-main-title">보러가기</h4>
      <article className="detail-platform-wrapper">
        {platforms.map((platform, index) => (
          <button type="button" className="detail-platform" onClick={() => window.open(platform.url)} key={index}>
            <img className="platform-image" src={`/assets/platform/${platform.code}.png`} alt="플랫폼" />
          </button>
        ))}
      </article>
    </section>
  );

  return isEmpty(platforms) ? null : renderPlatform();
});

export default VideoSectionPlatform;
