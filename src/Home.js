import { useLocation } from "react-router-dom";
import React from "react";

import Header from "./Header";
import SearchForm from "./SearchForm";
import SearchBySet from "./SearchBySet";
import CarouselGallery from "./CarouselGallery";
import MobileCarouselGallery from "./MobileCarouselGallery";

function Home() {
  const location = useLocation();
  const rootPath = location.pathname === "/";
  const searchBySetsPath = location.pathname === "/search-by-set";

  // function writeUserData(userId, name, email) {
  //   console.log("writing user...");
  //   const db = getDatabase();
  //   set(ref(db, "users/" + userId), {
  //     username: name,
  //     email: email,
  //   });
  //   console.log("done!");
  // }

  localStorage.removeItem("order");

  if (rootPath) {
    localStorage.removeItem("pokemonName");
    localStorage.removeItem("pokemonSubtype");
  }

  return (
    <>
      <Header />
      {rootPath ? (
        <>
          <SearchForm />
          {window.innerWidth < 576 ? (
            <MobileCarouselGallery />
          ) : (
            <CarouselGallery />
          )}{" "}
        </>
      ) : null}
      {searchBySetsPath ? (
        <>
          <SearchBySet />
          {window.innerWidth < 576 ? (
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
