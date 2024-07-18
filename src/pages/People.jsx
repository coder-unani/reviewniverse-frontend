import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVideoSearch } from "/src/hooks/useVideoSearch";
import ProfileImage from "/src/components/Button/Profile/ProfileImage";
import Videos from "/src/components/Videos";
import { isEmpty } from "lodash";
import "/src/styles/People.css";

const People = () => {
  const navigate = useNavigate();
  const { peopleId: id } = useParams();
  const peopleId = parseInt(id);
  const location = useLocation();
  const people = location.state?.people;
  const [videos, setVideos] = useState({});
  const [page, setPage] = useState(1);
  const target = people.code === "10" ? "actor" : "staff";
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
  });

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (isNaN(peopleId) || !people) navigate("/404-not-found");
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
      <div className="people-wrapper">
        <section className="people">
          <ProfileImage image={people.picture} size={100} />
          <h1 className="name">{people.name}</h1>
        </section>
        <section className="people-contents">
          <Videos videos={videos} handlePage={handlePage} />
        </section>
      </div>
    </main>
  );
};

export default People;
