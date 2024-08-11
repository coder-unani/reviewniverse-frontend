import React, { useEffect, useState } from "react";
import Modal from "/src/components/Modal";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { getStorageKeyword, removeStorageKeyword } from "/src/utils/formatStorage";
import "/src/styles/SearchModal.css";

/**
 * TODO:
 * - 최근 검색어 표시
 * - 인기 검색어 표시
 * - 연관 검색어 표시
 */

const SearchModal = () => {
  const [recent, setRecent] = useState([]);

  // 최근 검색어 전체 삭제
  const handleClear = () => {
    removeStorageKeyword();
    setRecent([]);
  };

  const renderRecent = () => {
    return (
      <div className="recent">
        <div className="top">
          <p>최근 검색어</p>
          <button type="button" className="clear" onClick={handleClear}>
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
    const recentKeywords = getStorageKeyword();
    setRecent(recentKeywords);
  }, []);

  return (
    <Modal>
      <div className="search-modal">
        <div className="search">{!isEmpty(recent) && renderRecent()}</div>
      </div>
    </Modal>
  );
};

export default SearchModal;
