import React from "react";
import SearchLayout from "/src/layouts/search";
import Search from "/src/pages/Search";

const SearchRoutes = {
  path: "search",
  element: <SearchLayout />,
  children: [
    {
      index: true,
      element: <Search />,
    },
  ],
};

export default SearchRoutes;
