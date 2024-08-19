import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PeopleImage from "/src/components/Button/People/Image";
import Videos from "/src/components/Videos";
import { useVideos } from "/src/hooks/useVideos";
import { SETTINGS } from "/src/config/settings";
import { fParseInt } from "/src/utils/format";
import { isEmpty } from "lodash";

const People = () => {
  const navigate = useNavigate();
  const { peopleId } = useParams();
  const peopleId2Int = fParseInt(peopleId);
  const location = useLocation();
  // TODO: 고도화 필요
  const people = location.state && location.state.people ? location.state.people : {};
  const target = location.state && location.state.target ? location.state.target : "";
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState(null);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query: peopleId2Int,
    page,
    mode: "id",
    target,
    orderBy: "release_desc",
    enabled: peopleId2Int || !isEmpty(people) || !isEmpty(target),
  });

  useEffect(() => {
    if (peopleId2Int === 0 || isEmpty(people) || isEmpty(target)) {
      return navigate("/404-not-found");
    }
  }, [peopleId2Int, people, target, navigate]);

  useEffect(() => {
    if (videosIsLoading || !videosData) {
      return;
    }
    if (!videosData.status) {
      return navigate("/error");
    }
    if (page === 1) {
      setVideos({ ...videosData.data });
    } else {
      setVideos((prev) => {
        return {
          ...prev,
          count: videosData.data.count,
          page: videosData.data.page,
          data: prev.data ? [...prev.data, ...videosData.data.data] : [],
        };
      });
    }
  }, [videosIsLoading, videosData, page]);

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  if (videosError) {
    return navigate("/error");
  }

  if (isEmpty(videos)) {
    return;
  }

  const title = `${people.name} - 리뷰니버스`;
  const description = `${people.name}의 ${videos.total}개 작품`;
  const imageUrl = people.picture;
  const url = `${SETTINGS.DOMAIN_URL}/people/${peopleId2Int}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
      </Helmet>

      <main className="people-main-container">
        <section className="people-section">
          <div className="people-info-wrapper">
            <PeopleImage image={people.picture} size={100} />
            <h1 className="people-name">{people.name}</h1>
          </div>
        </section>
        <Videos videos={videos} handlePage={handlePage} />
      </main>
    </>
  );
};

export default People;
