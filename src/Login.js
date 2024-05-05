import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { app } from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  // signInWithPopup,
  // GoogleAuthProvider,
  // TwitterAuthProvider,
} from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";

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
import PropagateLoader from "react-spinners/PropagateLoader";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  // const googleProvider = new GoogleAuthProvider();
  // const twitterProvider = new TwitterAuthProvider();

  function addUserToDB(userId, name, email) {
    const db = getDatabase();

    update(ref(db, "users/" + userId), {
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

  // const googleLogin = () => {
  //   const auth = getAuth();

  //   signInWithPopup(auth, googleProvider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       // const credential = GoogleAuthProvider.credentialFromResult(result);
  //       // const token = credential.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...

  //       addUserToDB(user.uid, user.displayName, user.email);

  //       if (userIsLoggedIn) {
  //         const userInfo = {
  //           uid: user.uid,
  //           displayName: user.displayName,
  //           email: user.email,
  //           photoURL: user.photoURL,
  //         };

  //         localStorage.setItem("user", JSON.stringify(userInfo));
  //       }

  //       setTimeout(() => {
  //         navigate("/");
  //       }, 1500);
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);

  //       console.error(errorCode, errorMessage, email, credential);
  //       // ...
  //     });
  // };

  // const twitterLogin = () => {
  //   const auth = getAuth();

  //   signInWithPopup(auth, twitterProvider)
  //     .then((result) => {
  //       const credential = TwitterAuthProvider.credentialFromResult(result);
  //       // eslint-disable-next-line
  //       const token = credential.accessToken;
  //       // eslint-disable-next-line
  //       const secret = credential.secret;

  //       const user = result.user;

  //       addUserToDB(user.uid, user.displayName, user.email);

  //       if (userIsLoggedIn) {
  //         const userInfo = {
  //           uid: user.uid,
  //           displayName: user.displayName,
  //           email: user.email,
  //           photoURL: user.photoURL,
  //         };

  //         localStorage.setItem("user", JSON.stringify(userInfo));
  //       }

  //       setTimeout(() => {
  //         navigate("/");
  //       }, 1500);
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = TwitterAuthProvider.credentialFromError(error);

  //       console.error(errorCode, errorMessage, email, credential);
  //     });
  // };

  const login = (event) => {
    setLoading(true);

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        addUserToDB(user.uid, user.displayName, email);

        if (userIsLoggedIn) {
          if (!user.emailVerified) {
            sessionStorage.setItem(
              "emailNotVerifiedUser",
              JSON.stringify(user)
            );
            navigate("/verify-email");
          } else {
            // console.log("email already verified");

            const userInfo = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            };

            localStorage.setItem("user", JSON.stringify(userInfo));

            // console.log("Successful login!");

            setTimeout(() => {
              setLoading(false);

              navigate("/");
            }, 1500);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error.code);
        console.error(error.message);
      });
  };

  function showLoadingScreen() {
    return (
      isLoading && (
        <>
          <div
            style={{
              zIndex: "10000",
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function handleForgotPassword() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        // console.log("Password reset email sent!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorCode, errorMessage);
      });
  }

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

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

  return (
    <>
      {showLoadingScreen()}
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        <div className="login-container">
          <Row
            className="d-flex justify-content-center"
            style={{ marginTop: "10px" }}
          >
            <Link
              to="#"
              onClick={goBackOne}
              style={{ marginLeft: "25px" }}
              className="return-link"
            >
              <MuiIcon.ArrowBackIcon /> Return
            </Link>
            <Image src={Images.masterball} style={{ width: "80px" }} />
          </Row>
          <div className="form-container">
            <Form className="login-form">
              <Form.Group>
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
                    type={showPassword ? "current-password" : "password"}
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

                <span className="mb-0 d-flex justify-content-center">
                  Don't have an account?{" "}
                  <Link to="/create-account" className="mx-2">
                    Sign up
                  </Link>
                </span>

                <Button className="create-account-btn" onClick={login}>
                  Log in
                </Button>
                <Link
                  onClick={handleForgotPassword}
                  className="d-flex align-items-center justify-content-center mb-4"
                >
                  Forgot password?
                </Link>

                {/* <hr />
                <div className="socials-container">
                  Or sign in with your socials
                </div>

                <div className="socials-container justify-content-evenly mt-2 mb-4">
                  <MuiIcon.GoogleIcon
                    className="google-icon"
                    onClick={googleLogin}
                  />

                  <MuiIcon.FacebookIcon className="facebook-icon" />

                  <MuiIcon.XIcon className="x-icon" onClick={twitterLogin} />
                </div> */}
              </Form.Group>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Login;
