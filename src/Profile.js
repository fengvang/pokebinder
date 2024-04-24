import React, { useState } from "react";
// eslint-disable-next-line
import app from "./firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref as dbRef, update } from "firebase/database";

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
  const auth = getAuth();
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [username, setUsername] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  function updateUsernameInDB(userId, name) {
    const db = getDatabase();
    const userRef = dbRef(db, "users/" + userId);

    update(userRef, {
      username: name,
    })
      .then(() => {
        console.log("Username updated successfully in the database.");
      })
      .catch((error) => {
        console.error("Error updating username:", error);
      });
  }

  function extractImageName(url) {
    if (url) {
      const startIndex = url.indexOf("%2F") + 3;
      const endIndex = url.indexOf("?alt");

      return url.substring(startIndex, endIndex);
    } else return null;
  }

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image || !image.type.startsWith("image/")) {
      console.error("Please select an image file.");
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);

    uploadBytes(storageRef, image)
      .then((snapshot) => {
        // Get download URL for the uploaded image
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            setProfileImage(downloadURL);
            // naive approach to updating header profile image on change
            document.getElementById(
              "profile-image"
            ).style.content = `url(${downloadURL})`;
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
    const user = auth.currentUser;
    const oldImage = extractImageName(user?.photoURL);
    const oldImageURL = user.photoURL;
    const newImage = extractImageName(imageURL);

    console.log(oldImage);
    console.log(newImage);

    if (user) {
      updateProfile(user, {
        photoURL: imageURL,
      })
        .then(() => {
          localStorage.setItem("user", JSON.stringify(user));
          console.log("Image updated.");
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // After updating image, delete old profile image from storage
    const storage = getStorage();
    console.log(oldImage !== newImage && oldImage);
    if (oldImage !== newImage && oldImage) {
      try {
        console.log(oldImageURL);
        const desertRef = ref(storage, oldImageURL);

        // delete the file
        deleteObject(desertRef)
          .then(() => {
            // file deleted successfully
            console.log("Successfully deleted old profile pic");
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleNameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleSaveChanges = async (name) => {
    const user = auth.currentUser;

    try {
      if (user) {
        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            updateUsernameInDB(currentUser.uid, name);
            setUsername(name);
            localStorage.setItem("user", JSON.stringify(user));
            console.log("Name updated.");
          })
          .catch((error) => {
            console.error(error);
          });
      }

      document.getElementById("header-username").textContent = name;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      {currentUser && (
        <Col sm={12} md={3} style={{ padding: "25px" }}>
          <Row className="profile-details">
            <h2>{username || currentUser.displayName}</h2>
          </Row>

          <Row className="profile-details">
            <p>{currentUser.email}</p>
          </Row>
          <Image
            src={profileImage || currentUser.photoURL}
            alt={currentUser.displayName}
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
                  className="image-upload-input"
                  onChange={handleChange}
                />
                <Button className="upload-button" onClick={handleUpload}>
                  <i className="bi bi-upload"></i>
                </Button>
              </InputGroup>
            </Form.Group>
          </Row>

          <Row className="profile-details">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="New username"
                aria-label="new-username"
                className="change-username-input"
                onChange={handleNameChange}
              />
              <Button
                className="button"
                style={{ width: "110px", marginLeft: "0px", marginTop: "25px" }}
                onClick={() => handleSaveChanges(newUsername)}
              >
                Save changes
              </Button>
            </Form.Group>
          </Row>
        </Col>
      )}
    </Container>
  );
}

export default Profile;
