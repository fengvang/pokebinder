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
  const { user, isAuthenticated } = useAuth0();
  let { isLoading } = useAuth0();
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [username, setUsername] = useState(user?.displayName || user?.nickname);
  const collection = JSON.parse(localStorage.getItem("myCollection"));

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

  const handleNameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleSaveChanges = async (name) => {
    try {
      await fetch("/change-username", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user.sub,
          username: name,
        }),
      });

      setUsername(name);

      document.getElementById("header-username").textContent = name;
    } catch (error) {
      console.error(error);
    }
  };

  const collectionWorth = () => {
    let totalPrice = 0;

    Object.values(collection).forEach((item) => {
      console.log(item);
      if (
        !isNaN(item.tcgplayer?.prices?.holofoil?.market) ||
        !isNaN(item.tcgplayer?.prices?.["1stEditionHolofoil"]?.market) ||
        !isNaN(item.tcgplayer?.prices?.reverseHolofoil?.market) ||
        !isNaN(item.tcgplayer?.prices?.["1stEditionNormal"]?.market) ||
        !isNaN(item.tcgplayer?.prices?.normal?.market)
      ) {
        if (item.tcgplayer?.prices?.normal?.market) {
          totalPrice += item.tcgplayer.prices.normal.market;
        } else if (item.tcgplayer?.prices?.reverseHolofoil?.market) {
          totalPrice += item.tcgplayer.prices.reverseHolofoil.market;
        } else if (item.tcgplayer?.prices?.["1stEditionHolofoil"]?.market) {
          totalPrice += item.tcgplayer.prices["1stEditionHolofoil"].market;
        } else if (item.tcgplayer?.prices?.["1stEditionNormal"]?.market) {
          totalPrice += item.tcgplayer.prices["1stEditionNormal"].market;
        }
        console.log(totalPrice);
      } else {
        console.log(NaN);
        return;
      }
    });

    return totalPrice.toFixed(2);
  };

  const worth = collectionWorth();

  return (
    isAuthenticated && (
      <Container>
        <Col sm={12} md={3} style={{ padding: "25px" }}>
          <Row className="profile-details">
            <h2>{username || user.displayName || user.nickname}</h2>
          </Row>

          <Row className="profile-details">
            <p>{user.email}</p>
          </Row>

          <Image
            src={profileImage || user.picture}
            alt={user.displayName || user.nickname}
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

          <Row>
            <span>Collection worth: $ {worth}</span>
          </Row>
        </Col>
      </Container>
    )
  );
}

export default Profile;
