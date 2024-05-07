import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";

import Header from "./Header";
import SearchForm from "./SearchForm";
import SearchBySet from "./SearchBySet";
import CarouselGallery from "./CarouselGallery";

function Home() {
  const location = useLocation();
  const rootPath = location.pathname === "/";
  const searchBySetsPath = location.pathname === "/search-by-set";
  const loginPath = location.pathname === "/login";
  const createAccountPath = location.pathname === "/create-account";

  if (rootPath) {
    localStorage.removeItem("pokemonName");
    localStorage.removeItem("pokemonSubtype");
  }

  useEffect(() => {
    if (loginPath || createAccountPath) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loginPath, createAccountPath]);

  return (
    <>
      <Header />
      {rootPath ? (
        <>
          <SearchForm />
          <CarouselGallery />
        </>
      ) : null}
      {searchBySetsPath ? (
        <>
          <SearchBySet />
          <CarouselGallery />
        </>
      ) : null}
    </>
  );
}

export default Home;
