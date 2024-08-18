import React from "react";
import SwiperCast from "/src/components/SwiperCast";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { isEmpty } from "lodash";
import { fActorCode } from "/src/utils/formatContent";

const VideoSectionActor = React.memo(() => {
  const { content } = useVideoDetailContext();
  const actors = content.data.actor;

  const renderActor = () => (
    <section className="detail-cast-section">
      <h4 className="detail-main-title">출연진</h4>
      <SwiperCast items={actors} target={"actor"} formatCode={fActorCode} />
    </section>
  );

  return isEmpty(actors) ? null : renderActor();
});

export default VideoSectionActor;
