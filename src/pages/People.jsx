import React, { useState, useEffect } from "react";
import PeopleImage from "/src/components/Button/People/PeopleImage";
import Videos from "/src/components/Videos";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVideos } from "/src/hooks/useVideos";
import { SETTINGS } from "/src/config/settings";
import { isEmpty } from "lodash";
import "/src/styles/People.css";

const People = () => {
  const navigate = useNavigate();
  const { peopleId: id } = useParams();
  const peopleId = parseInt(id);
  const location = useLocation();
  // TODO: 고도화 필요
  const people = location.state && location.state.people ? location.state.people : {};
  const target = location.state && location.state.target ? location.state.target : "";
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState({ count: 0, page: 1, data: [] });
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideos({
    query: peopleId,
    page,
    mode: "id",
    target,
    orderBy: "release_desc",
    enabled: !isEmpty(people) || !isEmpty(target),
  });

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (isNaN(peopleId) || isEmpty(people) || isEmpty(target)) navigate("/404-not-found");
  }, []);

  useEffect(() => {
    if (!videosData) return;
    if (page === 1) {
      setVideos(videosData);
    } else {
      setVideos((prev) => {
        return {
          ...prev,
          count: videosData.count,
          page: videosData.page,
          data: [...prev.data, ...videosData.data],
        };
      });
    }
  }, [videosData, page]);

  if (isEmpty(videos)) return;

  return (
    <>
      <Helmet>
        <title>{people.name} - 리뷰니버스</title>
        <meta name="description" content={`${people.name}의 ${videos.total}개 작품`} />
        <meta property="og:title" content={`${people.name} - 리뷰니버스`} />
        <meta property="og:description" content={`${people.name}의 ${videos.total}개 작품`} />
        <meta property="og:image" content={people.picture} />
        <meta property="og:url" content={`${SETTINGS.DOMAIN_URL}/people/${peopleId}`} />
      </Helmet>
      <main className="people-main">
        <section className="people-wrapper">
          <div className="people">
            <PeopleImage image={people.picture} size={100} />
            <h1 className="name">{people.name}</h1>
          </div>
        </section>
        <Videos videos={videos} handlePage={handlePage} />
      </main>
    </>
  );
};

export default People;
