import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import { Row, Button, Container, Dropdown, Image } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        console.log("Successfully logged out");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderLoginButton =
    !currentUser &&
    location.pathname !== "/login" &&
    !currentUser &&
    location.pathname !== "/create-account";

  return (
    <>
      {dropdownClicked ? showMobileDropdown() : null}

      <header id="header">
        <Container className="header-container">
          <Link to="/">
            <span style={{ fontSize: "2rem" }}>PokéBinder</span>
          </Link>
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

                <Dropdown.Menu>
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
    </>
  );
}

export default Header;
