import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useThemeContext } from "/src/context/ThemeContext";
import ClearButton from "/src/components/Button/Clear";
import {
  getStorageKeyword,
  setStorageKeyword,
  sliceStorageKeyword,
  clearStorageKeyword,
  removeStorageKeyword,
} from "/src/utils/formatStorage";
import { isEmpty, set } from "lodash";
import SearchIcon from "/src/assets/button/search.svg?react";
import CloseIcon from "/src/assets/button/close.svg?react";

/**
 * TODO:
 * - 연관 검색어 기능
 * - 자동저장 기능 on/off 기능
 */

const SearchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useThemeContext();
  const [isDropDown, setIsDropDown] = useState(false);
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  // 최근 검색어 저장 (최대 5개)
  const saveRecentKeywords = (keyword) => {
    setStorageKeyword(keyword);
    sliceStorageKeyword(5);
  };

  // 검색어 입력란 focus
  const handleSearchFocus = () => {
    if (isDropDown) return;
    setIsDropDown(true);
  };

  // 검색어 입력란 click
  const handleSearchClick = () => {
    if (isDropDown) return;
    setIsDropDown(true);
  };

  // 드롭다운 닫기
  const handleSearchClose = () => {
    setIsDropDown(false);
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  // 검색어 입력란 clear
  const handleSearchClear = () => {
    if (searchInputRef.current) {
      setInputValue("");
    }
  };

  // 검색어 입력란 submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputValue || !inputValue.trim()) return;
    handleSearchClose();
    saveRecentKeywords(inputValue);
    navigate(`/search?query=${inputValue}`);
  };

  // 최근 검색어 전체 삭제
  const handleRecentClear = () => {
    clearStorageKeyword();
    setRecentKeywords([]);
  };

  // 최근 검색어 개별 삭제
  const handleRecentRemove = (keyword) => {
    const result = removeStorageKeyword(keyword);
    setRecentKeywords(result);
  };

  useEffect(() => {
    handleSearchClose();

    // 최근 검색어 로컬 스토리지에서 불러오기
    const recent = getStorageKeyword();
    setRecentKeywords(recent);

    const path = location.pathname;
    if (!searchInputRef.current) return;
    // 검색 페이지가 아닌 경우 검색어 초기화
    if (path !== "/search") {
      setInputValue("");
    } else if (query) {
      // 검색 쿼리가 있음에도 검색어 입력란에 값이 없는 경우
      if (inputValue !== query) {
        setInputValue(query);
        saveRecentKeywords(query);
      }
    } else {
      // 검색어 입력란에 포커스
      searchInputRef.current.focus();
    }
  }, [location, query]);

  // 바깥 영역 클릭 시 모달 닫기
  useEffect(() => {
    const handleDropDownClose = (e) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        handleSearchClose();
      }
    };

    document.addEventListener("mousedown", handleDropDownClose);
    return () => {
      document.removeEventListener("mousedown", handleDropDownClose);
    };
  }, []);

  return (
    <>
      <form
        className="search-form"
        onFocus={handleSearchFocus}
        onClick={handleSearchClick}
        onSubmit={handleSearchSubmit}
      >
        <input
          className="search-input"
          type="text"
          placeholder="검색어를 입력하세요."
          ref={searchInputRef}
          value={inputValue}
          onChange={handleSearchChange}
        />
        {inputValue && <ClearButton className="search-form-clear" onClear={handleSearchClear} />}
        <button type="submit" className="search-form-button">
          <SearchIcon className="search-icon" />
        </button>
      </form>
      {!isMobile && isDropDown && (
        <div className="search-dropdown" tabIndex="0" ref={searchDropdownRef}>
          {isEmpty(recentKeywords) ? (
            <div className="search-empty">최근 검색이 없습니다.</div>
          ) : (
            <>
              <div className="search-header">
                <p className="search-title">최근 검색어</p>
                <button type="button" className="search-clear" onClick={handleRecentClear}>
                  전체 삭제
                </button>
              </div>
              <ul className="search-list">
                {recentKeywords.map((keyword, index) => (
                  <li className="search-item" key={index}>
                    <Link to={`/search?query=${keyword}`} className="search-link">
                      <SearchIcon />
                      <p className="search-keyword">{keyword}</p>
                    </Link>
                    <button type="button" className="search-remove" onClick={() => handleRecentRemove(keyword)}>
                      <CloseIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="search-footer">
            <button type="button" className="search-autocomplete">
              자동저장 끄기
            </button>
            <button type="button" className="search-close" onClick={handleSearchClose}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchForm;
