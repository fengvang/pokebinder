import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { app } from "./firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

import {
  Container,
  Form,
  Button,
  Image,
  Row,
  InputGroup,
} from "react-bootstrap";
import * as Images from "./Icons";
import * as MuiIcon from "./MuiIcons";
import {
  hasEightCharsOrMore,
  hasSpecialChar,
  hasCapitalLetter,
  hasNumber,
} from "./Functions";

function CreateAccount() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const provider = new GoogleAuthProvider();

  function addUserToDB(userId, name, email) {
    const db = getDatabase();

    set(ref(db, "users/" + userId), {
      username: name,
      email: email,
    });
  }

  function userIsLoggedIn() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) return true;
      else return false;
    });
  }

  const googleLogin = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        addUserToDB(user.uid, user.displayName, user.email);

        if (userIsLoggedIn) {
          const userInfo = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };

          localStorage.setItem("user", JSON.stringify(userInfo));
        }

        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error(errorCode, errorMessage, email, credential);
        // ...
      });
  };

  const createAccount = (event) => {
    const auth = getAuth();

    event.preventDefault();

    if (
      hasEightCharsOrMore(password) &&
      hasSpecialChar(password) &&
      hasCapitalLetter(password) &&
      hasNumber(password)
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          updateProfile(user, {
            displayName: username || email,
          })
            .then(() => {
              addUserToDB(user.uid, username, email);

              sessionStorage.setItem(
                "emailNotVerifiedUser",
                JSON.stringify(user)
              );

              if (userIsLoggedIn) {
                if (!user.emailVerified) {
                  sendEmailVerification(user).then(() => {
                    console.log("sending email");

                    navigate("/verify-email");
                  });
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error.code);
          console.error(error.message);
        });
    } else {
      console.log("Password doesn't meet requirements");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function goBackOne() {
    navigate(-1);
  }

  useEffect(() => {
    const header = document.querySelector("header");

    if (header) {
      const height = header.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, []);

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
    >
      <div className="login-container">
        <Row
          className="d-flex justify-content-center"
          style={{ marginTop: "25px" }}
        >
          <Link to="#" onClick={goBackOne} style={{ marginLeft: "25px" }}>
            <MuiIcon.ArrowBackIcon /> Return
          </Link>
          <Image src={Images.masterball} style={{ width: "80px" }} />
        </Row>
        <div className="form-container">
          <Form className="login-form">
            <Form.Group>
              <Form.Label className="mb-0">Username (optional)</Form.Label>
              <Form.Control
                type="input"
                placeholder="Username"
                className="mb-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Form.Label className="mb-0">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3"
              />

              <Form.Label className="mb-0">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-3 password-input"
                />
                {showPassword ? (
                  <MuiIcon.EyeOff
                    className="show-password-icon"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <MuiIcon.Eye
                    className="show-password-icon"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </InputGroup>

              <span className="mb-0 d-flex-row justify-content-center">
                {password !== "" && (
                  <p
                    className={`my-1 ${
                      hasEightCharsOrMore(password)
                        ? "password-credentials-green"
                        : "password-credentials-red"
                    }`}
                  >
                    {hasEightCharsOrMore(password) ? (
                      <MuiIcon.CheckIcon className="mx-2" />
                    ) : (
                      <MuiIcon.ErrorIcon className="mx-2" />
                    )}
                    At least 8 characters or more
                  </p>
                )}

                {password !== "" && (
                  <p
                    className={`my-1 ${
                      hasSpecialChar(password)
                        ? "password-credentials-green"
                        : "password-credentials-red"
                    }`}
                  >
                    {hasSpecialChar(password) ? (
                      <MuiIcon.CheckIcon className="mx-2" />
                    ) : (
                      <MuiIcon.ErrorIcon className="mx-2" />
                    )}
                    At least 1 special character
                  </p>
                )}

                {password !== "" && (
                  <p
                    className={`my-1 ${
                      hasCapitalLetter(password)
                        ? "password-credentials-green"
                        : "password-credentials-red"
                    }`}
                  >
                    {hasCapitalLetter(password) ? (
                      <MuiIcon.CheckIcon className="mx-2" />
                    ) : (
                      <MuiIcon.ErrorIcon className="mx-2" />
                    )}
                    At least 1 capital letter
                  </p>
                )}

                {password !== "" && (
                  <p
                    className={`my-1 ${
                      hasNumber(password)
                        ? "password-credentials-green"
                        : "password-credentials-red"
                    }`}
                  >
                    {hasNumber(password) ? (
                      <MuiIcon.CheckIcon className="mx-2" />
                    ) : (
                      <MuiIcon.ErrorIcon className="mx-2" />
                    )}
                    At least 1 number
                  </p>
                )}
              </span>

              <span className="mb-0 d-flex justify-content-center">
                Already have an account?{" "}
                <Link to="/login" className="mx-2">
                  Log in
                </Link>
              </span>

              <Button className="create-account-btn" onClick={createAccount}>
                Create Account
              </Button>

              <hr />
              <div className="socials-container">
                Or create account with your socials
              </div>

              <div className="socials-container justify-content-evenly mt-2 mb-4">
                <MuiIcon.GoogleIcon
                  className="google-icon"
                  onClick={googleLogin}
                />

                <MuiIcon.FacebookIcon className="facebook-icon" />

                <MuiIcon.XIcon className="x-icon" />
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default CreateAccount;
