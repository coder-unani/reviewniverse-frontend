import React, { useMemo } from "react";
import RatingVideo from "/src/components/RatingVideo";
import SwiperCast from "/src/components/SwiperCast";
import SwiperGallery from "/src/components/SwiperGallery";
import VideoReviews from "/src/components/VideoReviews";
import { useVideoDetailContext } from "/src/context/VideoDetailContext";
import { isEmpty } from "lodash";
import { fThumbnail, fPlatformFilter, fActorCode, fStaffCode } from "/src/utils/formatContent";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const PosterSection = React.memo(() => {
  const { content } = useVideoDetailContext();
  const poster = useMemo(() => fThumbnail(content.data.thumbnail), [content.data.thumbnail]);
  return (
    <section className="detail-poster-section">
      <picture className="detail-poster-wrapper">
        <LazyLoadImage className="detail-poster" src={poster} alt="포스터" effect="blur" />
      </picture>
    </section>
  );
});

const SynopsisSection = React.memo(() => {
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

const MyRatingSection = React.memo(() => {
  const { myInfo } = useVideoDetailContext();
  const rating = myInfo && myInfo.rating ? Math.floor(myInfo.rating / 2) : 0;
  const ratingText = rating > 0 ? rating : "-";
  return (
    <section className="detail-my-rating-section">
      <h4 className="detail-main-title">평가하기</h4>
      <div className="detail-my-rating">
        <span className="my-rating-text number" data-index={rating}>
          {ratingText}
        </span>
        <span className="my-rating-text">/</span>
        <span className="my-rating-text">5</span>
      </div>
      <RatingVideo />
    </section>
  );
});

const PlatformSection = React.memo(() => {
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

const ActorSection = React.memo(() => {
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

const StaffSection = React.memo(() => {
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

const GallerySection = React.memo(() => {
  const { content } = useVideoDetailContext();
  const gallery = content.data.thumbnail;
  const renderGallery = () => (
    <section className="detail-gallery-section">
      <h4 className="detail-main-title">갤러리</h4>
      <SwiperGallery items={gallery} />
    </section>
  );

  return isEmpty(gallery) ? null : renderGallery();
});

const ReviewSection = React.memo(() => {
  return <VideoReviews />;
});

export {
  PosterSection,
  SynopsisSection,
  MyRatingSection,
  PlatformSection,
  ActorSection,
  StaffSection,
  GallerySection,
  ReviewSection,
};
