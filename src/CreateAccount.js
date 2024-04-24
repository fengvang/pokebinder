import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { app } from "./firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

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
import { setCookie, getCookie } from "./Functions";

function CreateAccount() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const createAccount = (event) => {
    const auth = getAuth();

    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        updateProfile(user, {
          displayName: username,
        })
          .then(() => {
            console.log("Username updated.");
            setCookie("jwt", user.accessToken, 7);
          })
          .catch((error) => {
            console.error(error);
          });

        navigate("/");
      })
      .catch((error) => {
        console.error(error.code);
        console.error(error.message);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <div className="login-container">
        <Form className="login-form">
          <Row className="d-flex justify-content-center">
            <Image src={Images.masterball} style={{ width: "80px" }} />
          </Row>
          <Form.Group>
            <Form.Label className="mb-0">Username</Form.Label>
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

            <span className="mb-0 d-flex justify-content-center">
              Already have an account?{" "}
              <Link to="/login" className="mx-2">
                Log in
              </Link>
            </span>

            <Button className="create-account-btn" onClick={createAccount}>
              Create Account
            </Button>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
}

export default CreateAccount;
