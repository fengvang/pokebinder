import {
  getAuth,
  signOut,
  sendEmailVerification,
  signInWithCustomToken,
} from "firebase/auth";
import { useEffect, useState } from "react";

import { Container, Button } from "react-bootstrap";

function VerifyEmail() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const auth = getAuth();
  const [resendClicked, setResendClicked] = useState(false);
  const emailNotVerifiedUser = JSON.parse(
    sessionStorage.getItem("emailNotVerifiedUser")
  );

  const signInWithTokenAndSendEmail = async () => {
    try {
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-custom-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: emailNotVerifiedUser.uid,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }

      // get token from server
      const token = await response.json();

      signInWithCustomToken(auth, token)
        .then((userCredential) => {
          const user = userCredential.user;

          sendEmailVerification(user).then(() => {
            // console.log("sending email");

            sessionStorage.removeItem("emailNotVerifiedUserToken");
            sessionStorage.removeItem("emailNotVerifiedUser");

            setResendClicked(true);

            logout();
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        // console.log("Successfully logged out");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    logout();

    const header = document.querySelector("header");
    if (header) {
      const height = header.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.title = "Pokébinder - Verify Email";

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Container
        className="d-block text-center position-relative"
        style={{
          minHeight: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="d-block">
            <h3>Verify your email</h3>
          </div>
          <div className="d-block">
            We've sent an email verification to your email
            <b> {emailNotVerifiedUser?.email}</b>. If you do not see it, please
            check your spam folder or click the link below to resend another
            email verification.
          </div>
          {!resendClicked ? (
            <>
              <div className="d-block">
                <Button
                  className="button mt-5"
                  style={{ width: "200px", margin: "0" }}
                  onClick={signInWithTokenAndSendEmail}
                >
                  Resend email verification.
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: "25px" }}>
                <h5>Email verification link sent!</h5>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
}

export default VerifyEmail;
