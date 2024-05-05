import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import { Row, Button, Container, Dropdown, Image } from "react-bootstrap";
import PropagateLoader from "react-spinners/PropagateLoader";
import HeaderSearchBar from "./HeaderSearchBar";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setLoading] = useState(false);
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  function showHeaderSearchBar() {
    return (
      location.pathname === "/pok%C3%A9mon-card" ||
      location.pathname === "/trainer-card" ||
      location.pathname === "/energy-card"
    );
  }

  function showMobileDropdown() {
    return (
      <div
        className="mobile-profile-dropdown-container"
        onClick={() => setDropdownClicked(false)}
      >
        <div className="mobile-profile-dropdown">
          <Row>
            <Link to="/collection">Collection</Link>
          </Row>
          <Row>
            <Link to="/profile">Account Settings</Link>
          </Row>
          <Button
            className="logout-button"
            style={{ marginTop: "25px" }}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  const logout = () => {
    setLoading(true);
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        localStorage.clear();
        sessionStorage.removeItem("sessionCollectionOriginal");
        sessionStorage.removeItem("sessionCollection");
        // console.log("Successfully logged out");

        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  function showLoadingScreen() {
    return (
      isLoading && (
        <>
          <div
            style={{
              zIndex: "9999",
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              backgroundColor: "var(--bgcolor)",
            }}
            className="d-flex align-items-center justify-content-center vh-100"
          >
            <PropagateLoader color="#ffffff" />
          </div>
        </>
      )
    );
  }

  const renderLoginButton =
    !currentUser &&
    location.pathname !== "/login" &&
    !currentUser &&
    location.pathname !== "/create-account";

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

  return (
    <>
      {showLoadingScreen()}
      {dropdownClicked ? showMobileDropdown() : null}

      <header
        id="header"
        style={{
          boxShadow:
            (window.innerWidth < 768 &&
              location.pathname === "/pok%C3%A9mon-card") ||
            location.pathname === "/trainer-card" ||
            location.pathname === "/energy-card"
              ? "none"
              : "0px 0px 10px 1px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Container className="header-container">
          <Link to="/">
            <span style={{ fontSize: "2rem" }}>PokéBinder</span>
          </Link>

          {showHeaderSearchBar() && window.innerWidth > 768 ? (
            <HeaderSearchBar />
          ) : null}

          {currentUser ? (
            <>
              <Dropdown>
                <Dropdown.Toggle as="div">
                  <span onClick={() => setDropdownClicked(true)}>
                    <Image
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      id="profile-image"
                    />{" "}
                    <span style={{ fontSize: "1rem" }} id="header-username">
                      {currentUser.displayName}
                    </span>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ zIndex: "10001" }}>
                  <Dropdown.Item href="/collection">Collection</Dropdown.Item>
                  <Dropdown.Item href={currentUser ? "/profile" : "/"}>
                    Account Settings
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <Button
                      className="logout-button"
                      style={{ marginTop: "10px" }}
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            renderLoginButton && (
              <>
                <Link to="/login" className="login-header-button">
                  <span>
                    <i className="bi bi-person-circle"></i>{" "}
                    <span style={{ fontSize: "1rem" }}>Login</span>
                  </span>
                </Link>
              </>
            )
          )}
        </Container>
      </header>

      {showHeaderSearchBar() && window.innerWidth < 768 ? (
        <div className="mobile-header-search" style={{ zIndex: "9999" }}>
          <HeaderSearchBar />
        </div>
      ) : null}
    </>
  );
}

export default Header;
