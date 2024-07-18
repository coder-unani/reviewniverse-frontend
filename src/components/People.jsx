import React from "react";
import { Link } from "react-router-dom";
import PeopleImage from "/src/components/Button/People/PeopleImage";

const People = (props) => {
  const { crew, formatCode } = props;

  return (
    <Link to={`/people/${crew.id}`} state={{ people: crew }} className="crew" key={crew.id}>
      <PeopleImage image={crew.picture} size={54} />
      <div className="name-wrapper">
        <span className="name">{crew.name}</span>
        <div className="role">
          <span>{formatCode(crew.code)}</span>
          {crew.role && (
            <>
              <span>|</span>
              <span>{crew.role}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default People;
