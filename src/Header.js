import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import { Row, Button, Container, Dropdown } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const auth = getAuth();
  const user = auth?.currentUser;

  console.log("user from header", user);

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
          <Button className="logout-button" style={{ marginTop: "25px" }}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Successfully logged out");

        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <>
      {dropdownClicked ? showMobileDropdown() : null}

      <header>
        <Container className="header-container">
          <Link to="/">
            <span style={{ fontSize: "2rem" }}>PokéBinder</span>
          </Link>
          {user ? (
            <>
              <Dropdown>
                <Dropdown.Toggle as="div">
                  <span onClick={() => setDropdownClicked(true)}>
                    {/* <Image
                      src={user.picture}
                      alt={user.displayName || user.nickname}
                      style={{
                        height: "25px",
                        width: "25px",
                        objectFit: "cover",
                      }}
                      id="profile-image"
                      roundedCircle
                    />{" "} */}
                    <span style={{ fontSize: "1rem" }} id="header-username">
                      {user.displayName}
                    </span>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/collection">Collection</Dropdown.Item>
                  <Dropdown.Item href="/profile">
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
            <>
              <Link to="/login" className="login-header-button">
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
