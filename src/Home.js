import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

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
  const [showModal, setShowModal] = useState(false);

  if (rootPath) {
    localStorage.removeItem("pokemonName");
    localStorage.removeItem("pokemonSubtype");
  }

  console.log(window.navigator.userAgent);

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

  useEffect(() => {
    document.title = "Pokébinder - Home";

    // eslint-disable-next-line
  });

  function ShowModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        variant="dark"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title id="contained-modal-title-vcenter">Welcome!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Welcome to Pokébinder, your ultimate destination for all things
            Pokémon TCG! Dive into a vast collection of cards where you can
            browse, explore, and add to your personal collection. Track the
            evolving worth of your cards with ease, ensuring you stay ahead of
            the game. Start your journey to becoming a Pokémon Master today!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={props.onHide}
            className="modal-btn"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  useEffect(() => {
    if (!localStorage.getItem("modalShown")) {
      setShowModal(true);
      localStorage.setItem("modalShown", "true");
    } else {
      setShowModal(false);
    }
  }, []);

  return (
    <>
      <Header />
      {rootPath ? (
        <>
          <ShowModal show={showModal} onHide={() => setShowModal(false)} />

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
