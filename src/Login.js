import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { app } from "./firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = (event) => {
    const auth = getAuth();

    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        console.log("Successful login!");
        // ...

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
              Don't have an account?{" "}
              <Link to="/create-account" className="mx-2">
                Sign up
              </Link>
            </span>

            <Button className="create-account-btn" onClick={login}>
              Log in
            </Button>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
