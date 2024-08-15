import React from "react";
import { Link } from "react-router-dom";
import PeopleImage from "/src/components/Button/People/Image";

const PeopleItem = ({ crew, target, formatCode }) => {
  return (
    <Link to={`/people/${crew.id}`} state={{ people: crew, target }} className="detail-people-link" key={crew.id}>
      <PeopleImage image={crew.picture} size={60} />
      <div className="detail-people-info-wrapper">
        <p className="detail-people-name">{crew.name}</p>
        <div className="detail-people-role-wrapper">
          <span className="detail-people-role">{formatCode(crew.code)}</span>
          {crew.role && (
            <>
              <span className="detail-people-role">|</span>
              <span className="detail-people-role">{crew.role}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PeopleItem;
