import React, { useState, useEffect } from "react";
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

import { Col, Row, Button, Form, Image, InputGroup } from "react-bootstrap";
import { Slide, ToastContainer } from "react-toastify";
import {
  profileImageUpdated,
  errorUploadingFile,
  errorChangingUsername,
  errorTryAgain,
  errorNotImage,
  usernameUpdated,
} from "./Functions";

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
        // console.log("Username updated successfully in the database.");
      })
      .catch((error) => {
        console.error("Error updating username:", error);
        errorChangingUsername();
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
      errorNotImage();
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
            errorTryAgain();
          });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        errorUploadingFile();
      });
  };

  const updateUserImage = async (imageURL) => {
    const user = auth.currentUser;
    const oldImage = extractImageName(user?.photoURL);
    const oldImageURL = user.photoURL;
    const newImage = extractImageName(imageURL);

    // console.log(oldImage);
    // console.log(newImage);

    if (user) {
      updateProfile(user, {
        photoURL: imageURL,
      })
        .then(() => {
          localStorage.setItem("user", JSON.stringify(user));
          // console.log("Image updated.");
          profileImageUpdated();
        })
        .catch((error) => {
          console.error(error);
          errorTryAgain();
        });
    }

    // After updating image, delete old profile image from storage
    const storage = getStorage();
    // console.log(oldImage !== newImage && oldImage);
    if (
      oldImage !== newImage &&
      oldImage &&
      oldImageURL !==
        "https://firebasestorage.googleapis.com/v0/b/pokebinder-ae627.appspot.com/o/images%2Fdefault_img.webp?alt=media&token=734408c8-a8ee-466f-893c-79e535d2fd4c"
    ) {
      try {
        // console.log(oldImageURL);
        const desertRef = ref(storage, oldImageURL);

        // delete the file
        deleteObject(desertRef)
          .then(() => {
            // file deleted successfully
            // console.log("Successfully deleted old profile pic");
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
            // console.log("Name updated.");
            usernameUpdated();
          })
          .catch((error) => {
            console.error(error);
            errorTryAgain();
          });
      }

      document.getElementById("header-username").textContent = name;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.title = `Pokébinder - ${currentUser.displayName}'s Profile`;

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer
        position={window.innerWidth < 768 ? "bottom-center" : "top-center"}
        theme="dark"
        transition={Slide}
      />
      {currentUser && (
        <Col sm={12} md={3} style={{ padding: "25px" }}>
          <Row className="profile-details">
            <h2>{username || currentUser.displayName}</h2>
          </Row>

          <Row className="profile-details">
            <p>{currentUser.email}</p>
          </Row>
          <Image
            src={
              profileImage ||
              currentUser.photoURL ||
              "https://firebasestorage.googleapis.com/v0/b/pokebinder-ae627.appspot.com/o/images%2Fdefault_img.webp?alt=media&token=734408c8-a8ee-466f-893c-79e535d2fd4c"
            }
            alt={currentUser.displayName}
            style={{
              height: "200px",
              width: "200px",
              objectFit: "cover",
            }}
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
    </>
  );
}

export default Profile;
