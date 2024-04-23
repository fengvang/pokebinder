import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { Row, Button, Container, Dropdown, Image } from "react-bootstrap";

function Header() {
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
                      alt={user.displayName || user.nickname}
                      style={{
                        height: "25px",
                        width: "25px",
                        objectFit: "cover",
                      }}
                      id="profile-image"
                      roundedCircle
                    />{" "}
                    <span style={{ fontSize: "1rem" }} id="header-username">
                      {user.displayName || user.nickname}
                    </span>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/">Collection</Dropdown.Item>
                  <Dropdown.Item href="/profile">
                    Account Settings
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
    </>
  );
}

export default Header;
