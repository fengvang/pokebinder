import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// eslint-disable-next-line
import app from "./firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  Container,
  Col,
  Row,
  Button,
  Form,
  Image,
  InputGroup,
} from "react-bootstrap";

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);

    uploadBytes(storageRef, image)
      .then((snapshot) => {
        // Get download URL for the uploaded image
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            // Update user image using the obtained download URL
            updateUserImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const updateUserImage = async (imageURL) => {
    try {
      const response = await fetch("/change-user-image", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user.sub,
          image: imageURL,
        }),
      });

      const data = await response.json();

      const oldImage = data.oldImageURL;
      const newImage = data.newImageURL;

      setProfileImage(newImage);

      // naive approach to updating header profile image on change
      document.getElementById(
        "profile-image"
      ).style.content = `url(${newImage})`;

      // After updating image, delete old profile image from storage
      const storage = getStorage();

      try {
        const desertRef = ref(storage, oldImage);

        // delete the file
        deleteObject(desertRef)
          .then(() => {
            // file deleted successfully
            console.log("Successfully deleted old profile pic");
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    isAuthenticated && (
      <Container>
        <Col sm={12} md={3} style={{ padding: "25px" }}>
          <Row className="profile-details">
            <h2>{user.nickname}</h2>
          </Row>

          <Row className="profile-details">
            <p>{user.email}</p>
          </Row>

          <Image
            src={profileImage || user.picture}
            alt={user.nickname}
            style={{
              height: "200px",
              width: "200px",
              objectFit: "cover",
            }}
            roundedCircle
          />

          <Row className="profile-details">
            <Form.Group controlId="formFile" className="my-3">
              <InputGroup>
                <Form.Control
                  type="file"
                  onChange={handleChange}
                  className="image-upload-input"
                />
                <Button onClick={handleUpload} className="upload-button">
                  <i className="bi bi-upload"></i>
                </Button>
              </InputGroup>
            </Form.Group>
          </Row>
        </Col>
      </Container>
    )
  );
}

export default Profile;
