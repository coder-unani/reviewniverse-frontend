import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { DEFAULT_IMAGES } from "/src/config/constants";

const Crew = (props) => {
  const { crew, type } = props;

  return (
    <div className="crew" key={crew.id}>
      <figure className="image">
        <LazyLoadImage src={crew.picture || DEFAULT_IMAGES.noActor} alt={crew.name} effect="blur" />
      </figure>
      <div className="name-wrapper">
        <span className="name">{crew.name}</span>
        <div className="role">
          <span>{type(crew.code)}</span>
          {crew.role && (
            <>
              <span>|</span>
              <span>{crew.role}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Crew;
