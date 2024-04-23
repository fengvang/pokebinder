import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getDatabase, ref, set } from "firebase/database";

import Header from "./Header";
import SearchForm from "./SearchForm";
import SearchBySet from "./SearchBySet";
import CarouselGallery from "./CarouselGallery";
import MobileCarouselGallery from "./MobileCarouselGallery";

function Home() {
  const location = useLocation();
  const rootPath = location.pathname === "/";
  const searchBySetsPath = location.pathname === "/search-by-set";
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  function writeUserData(userId, name, email) {
    console.log("writing user...");
    const db = getDatabase();
    set(ref(db, "users/" + userId), {
      username: name,
      email: email,
    });
    console.log("done!");
  }

  localStorage.removeItem("order");

  if (rootPath) {
    localStorage.removeItem("pokemonName");
    localStorage.removeItem("pokemonSubtype");
  }

  const getAuth0Token = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token);
      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  async function authenticateWithFirebase() {
    try {
      const token = await getAuth0Token();

      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyDHyzPgermECUPJsmYDInh9K82VYGrD0e0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to exchange access token");
      }
    } catch (error) {
      console.error(error);
    }
  }

  authenticateWithFirebase();

  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     writeUserData(user.sub, user.displayName || user.nickname, user.email);
  //   }
  // }, [isAuthenticated, user]);

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
