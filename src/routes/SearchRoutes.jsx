import React from "react";
import { AuthContextProvider } from "/src/context/AuthContext";
import SearchLayout from "/src/layouts/search";
import Search from "/src/pages/Search";

const SearchRoutes = {
  path: "search",
  element: (
    <AuthContextProvider>
      <SearchLayout />
    </AuthContextProvider>
  ),
  children: [
    {
      index: true,
      element: <Search />,
    },
  ],
};

export default SearchRoutes;
