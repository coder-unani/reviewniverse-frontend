import React, { useState, useEffect } from "react";
import PeopleImage from "/src/components/Button/People/PeopleImage";
import Videos from "/src/components/Videos";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVideoSearch } from "/src/hooks/useVideoSearch";
import { isEmpty } from "lodash";
import "/src/styles/People.css";

const People = () => {
  const navigate = useNavigate();
  const { peopleId: id } = useParams();
  const peopleId = parseInt(id);
  const location = useLocation();
  const people = location.state && location.state.people ? location.state.people : {};
  const target = location.state && location.state.target ? location.state.target : "";
  const [videos, setVideos] = useState({});
  const [page, setPage] = useState(1);
  const {
    data: videosData,
    error: videosError,
    isLoading: videosIsLoading,
  } = useVideoSearch({
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
    if (isEmpty(videosData)) return;
    if (videosData.status === 200) {
      if (page === 1) {
        setVideos(videosData.data);
      } else {
        setVideos((prev) => {
          return {
            ...prev,
            count: videosData.data.count,
            page: videosData.data.page,
            data: [...prev.data, ...videosData.data.data],
          };
        });
      }
    } else {
      setVideos({ data: [] });
    }
  }, [page, videosData]);

  if (isEmpty(videos)) return;

  return (
    <main className="people-main">
      <section className="people-wrapper">
        <div className="people">
          <PeopleImage image={people.picture} size={100} />
          <h1 className="name">{people.name}</h1>
        </div>
      </section>
      <Videos videos={videos} handlePage={handlePage} />
    </main>
  );
};

export default People;
