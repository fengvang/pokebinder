import { useLocation, Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Image, Dropdown, Button, Row } from "react-bootstrap";

import SearchForm from "./SearchForm";
import CarouselGallery from "./CarouselGallery";
import MobileCarouselGallery from "./MobileCarouselGallery";

function Home() {
  const location = useLocation();
  const rootPath = location.pathname === "/";
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [dropdownClicked, setDropdownClicked] = useState(false);

  function showMobileDropdown() {
    return (
      <div
        className="mobile-profile-dropdown-container"
        onClick={() => setDropdownClicked(false)}
      >
        <div className="mobile-profile-dropdown">
          <Row>
            <Link to="/">Collection</Link>
          </Row>
          <Row>
            <Link to="/profile">Account Settings</Link>
          </Row>
          <Button
            onClick={() =>
              logout({
                logoutParams: { returnTo: window.location.origin },
              })
            }
            className="logout-button"
            style={{ marginTop: "25px" }}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <MobileProfileDropdown /> */}
      {dropdownClicked ? showMobileDropdown() : null}

      <header>
        <Container className="header-container">
          <Link to="/">
            <span style={{ fontSize: "2rem" }}>PokéBinder</span>
          </Link>
          {isAuthenticated ? (
            <>
              <Dropdown>
                <Dropdown.Toggle as="div">
                  <span onClick={() => setDropdownClicked(true)}>
                    <Image
                      src={user.picture}
                      alt={user.nickname}
                      style={{
                        height: "25px",
                        width: "25px",
                        objectFit: "cover",
                      }}
                      id="profile-image"
                      roundedCircle
                    />{" "}
                    <span style={{ fontSize: "1rem" }}>{user.nickname}</span>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Row>
                      <Link to="/">Collection</Link>
                    </Row>
                    <Row>
                      <Link to="/profile">Account Settings</Link>
                    </Row>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Button
                      onClick={() =>
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        })
                      }
                      className="logout-button"
                      style={{ marginTop: "10px" }}
                    >
                      Logout
                    </Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Link
                onClick={() => loginWithRedirect()}
                className="login-header-button"
              >
                <span>
                  <i className="bi bi-person-circle"></i>{" "}
                  <span style={{ fontSize: "1rem" }}>Login</span>
                </span>
              </Link>
            </>
          )}
        </Container>
      </header>
      {rootPath ? (
        <>
          <SearchForm />
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
