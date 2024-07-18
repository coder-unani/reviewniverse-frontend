import React, { useEffect, useState } from "react";
import Modal from "/src/components/Modal";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { getLocalStorage, clearLocalStorage } from "/src/utils/localStorage";
import "/src/styles/SearchModal.css";

/**
 * TODO:
 * - 연관 검색어 표시
 */

const SearchModal = () => {
  const [recent, setRecent] = useState([]);

  // 최근 검색어 전체 삭제
  const handleClear = () => {
    clearLocalStorage("RECENT_SEARCH_KEYWORDS");
    setRecent([]);
  };

  const renderRecent = () => {
    return (
      <div className="recent">
        <div className="top">
          <p>최근 검색어</p>
          <button className="clear" onClick={handleClear}>
            모두 삭제
          </button>
        </div>
        <div className="bottom">
          <ul>
            {recent.map((keyword, index) => (
              <li key={index}>
                <Link to={`/search?query=${keyword}`}>{keyword}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const recentKeywords = getLocalStorage("RECENT_SEARCH_KEYWORDS");
    setRecent(recentKeywords);
  }, []);

  return (
    <Modal>
      <div className="search-modal">
        <div className="search">
          {!isEmpty(recent) && renderRecent()}
          {/* 인기 검색어 */}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
