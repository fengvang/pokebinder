import { useLocation } from "react-router-dom";
import React from "react";

import Header from "./Header";
import SearchForm from "./SearchForm";
import SearchBySet from "./SearchBySet";
import CarouselGallery from "./CarouselGallery";
import MobileCarouselGallery from "./MobileCarouselGallery";
// import { fetchAllCards } from "./Functions";

function Home() {
  const location = useLocation();
  const rootPath = location.pathname === "/";
  const searchBySetsPath = location.pathname === "/search-by-set";
  const loginPath = location.pathname === "/login";
  const createAccountPath = location.pathname === "/create-account";
  // const allCards = sessionStorage.getItem("allCards");

  if (rootPath) {
    localStorage.removeItem("pokemonName");
    localStorage.removeItem("pokemonSubtype");
  }

  if (loginPath || createAccountPath)
    document.querySelector("body").style.overflow = "hidden";

  // useEffect(() => {
  //   if (!allCards) {
  //     fetchAllCards();
  //   }
  // }, []);

  return (
    <>
      <Header />
      {rootPath ? (
        <>
          <SearchForm />
          {window.innerWidth < 567 || window.innerWidth < 768 ? (
            <MobileCarouselGallery />
          ) : (
            <CarouselGallery />
          )}{" "}
        </>
      ) : null}
      {searchBySetsPath ? (
        <>
          <SearchBySet />
          {window.innerWidth < 567 || window.innerWidth < 768 ? (
            <MobileCarouselGallery />
          ) : (
            <CarouselGallery />
          )}
        </>
      ) : null}
    </>
  );
}

export default Home;
