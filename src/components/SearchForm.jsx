import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSearchLine } from "@remixicon/react";

const SearchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 검색어 입력란
  const searchInputRef = useRef(null);

  // 검색 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchQuery = searchInputRef.current.value;
    if (!searchQuery || !searchQuery.trim()) return;
    navigate(`/search?query=${searchQuery}`);
  };

  useEffect(() => {
    const path = location.pathname;

    if (!searchInputRef.current) return;

    // 검색 페이지가 아닌 경우 검색어 초기화
    if (path !== "/search" && searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    // 검색 쿼리가 있음에도 검색어 입력란에 값이 없는 경우
    if (path === "/search" && searchInputRef.current) {
      const params = new URLSearchParams(location.search);
      const query = params.get("query");
      searchInputRef.current.value = query;
    }
  }, [location]);

  return (
    <form className="search" onSubmit={handleSearchSubmit}>
      <RiSearchLine size={20} />
      <input type="text" placeholder="검색어를 입력하세요." ref={searchInputRef} />
    </form>
  );
};

export default SearchForm;
