import React from "react";
import SwiperCast from "/src/components/SwiperCast";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { isEmpty } from "lodash";
import { fStaffCode } from "/src/utils/formatContent";

const VideoSectionStaff = React.memo(() => {
  const { content } = useVideoDetailContext();
  const staffs = content.data.staff;

  const renderStaff = () => (
    <section className="detail-cast-section">
      <h4 className="detail-main-title">제작진</h4>
      <SwiperCast items={staffs} target={"staff"} formatCode={fStaffCode} />
    </section>
  );

  return isEmpty(staffs) ? null : renderStaff();
});

export default VideoSectionStaff;
