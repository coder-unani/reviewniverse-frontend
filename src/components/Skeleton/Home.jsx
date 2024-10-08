import React, { useState, useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonHome = () => {
  const [previewCount, setPreviewCount] = useState(4);
  const [videoCount, setVideoCount] = useState(20);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    const width = window.innerWidth;

    if (width < 769) {
      setPreviewCount(2);
      setVideoCount(6);
    } else if (width < 1024) {
      setVideoCount(8);
    } else if (width < 1281) {
      setPreviewCount(3);
      setVideoCount(10);
    } else {
      setPreviewCount(4);
    }
  };

  return (
    <SkeletonTheme baseColor="#12222b" highlightColor="#263d4b">
      <main className="home-main-container">
        <section className="home-preview-section">
          <div className="preview-info-container">
            <div className="skeleton-preview-info-wrapper">
              <div className="skeleton-preview-title-wrapper">
                <div className="preview-title">
                  <Skeleton className="skeleton-preview-title-og" />
                  <Skeleton className="skeleton-preview-title-kr" />
                </div>
              </div>
            </div>
          </div>
          <div className="preview-videos-container">
            <div className="skeleton-preview-videos-wrapper">
              <div className="skeleton-preview-videos">
                {new Array(previewCount).fill(0).map((_, index) => (
                  <div className="preview-video-item" key={index}>
                    <div className="preview-video-link">
                      <Skeleton className="preview-thumbnail-image" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="home-main-section">
          <section className="vertical-videos-section">
            <div className="skeleton-vertical-title-wrapper">
              <Skeleton className="skeleton-vertical-title" />
            </div>
            <div className="vertical-videos-wrapper">
              {new Array(videoCount).fill(0).map((_, index) => (
                <article key={index} className="default-video-item">
                  <div className="skeleton-thumbnail-container">
                    <Skeleton className="skeleton-default-thumbnail" />
                  </div>
                  <div className="skeleton-info-container">
                    <div className="skeleton-title-wrapper">
                      <Skeleton className="skeleton-title" />
                    </div>
                    <div className="skeleton-subtitle-wrapper">
                      <Skeleton className="skeleton-subtitle" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </SkeletonTheme>
  );
};

export default SkeletonHome;
