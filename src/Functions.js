import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import * as Icon from "./Icons";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const setCookie = (name, value, days) => {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const getCookie = (name) => {
  const cookies = document.cookie.split("; ").reduce((prev, current) => {
    const [name, value] = current.split("=");
    prev[name] = value;
    return prev;
  }, {});

  return cookies[name];
};

export function collectionTextWithImage(name) {
  let substrIndex, updatedName;

  switch (true) {
    case name.includes("BREAK"):
      substrIndex = name.indexOf("BREAK");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {truncate(updatedName)}{" "}
          <Image src={Icon.breaklogo} alt="BREAK" style={{ width: "60px" }} />
        </span>
      );
    case name.includes("-GX"):
      substrIndex = name.indexOf("-GX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {truncate(updatedName)} &nbsp;
          <Image src={Icon.gx} alt="GX" style={{ width: "35px" }} />
        </span>
      );
    case name.includes("ex") && name !== "Toxapex":
      substrIndex = name.indexOf("ex");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {truncate(updatedName)}{" "}
          <Image src={Icon.ex} alt="ex" style={{ width: "25px" }} />
        </span>
      );
    case name.includes("-EX"):
      substrIndex = name.indexOf("-EX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {truncate(updatedName)}{" "}
          <Image src={Icon.exOld} alt="EX" style={{ width: "30px" }} />
        </span>
      );
    case name.includes(" V") &&
      !name.includes("VMAX") &&
      !name.includes("VSTAR"):
      substrIndex = name.lastIndexOf("V");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {truncate(updatedName)}{" "}
          <Image
            src={Icon.v}
            alt="V"
            style={{ width: window.innerWidth < 768 ? "20px" : "25px" }}
          />
        </span>
      );
    case name.includes("VMAX"):
      substrIndex = name.indexOf("VMAX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {truncate(updatedName)}{" "}
          <Image
            src={Icon.vmax}
            alt="VMAX"
            style={{ width: window.innerWidth < 768 ? "35px" : "40px" }}
          />
        </span>
      );
    case name.includes("VSTAR"):
      substrIndex = name.indexOf("VSTAR");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {truncate(updatedName)}{" "}
          <Image
            src={Icon.vstar}
            alt="VSTAR"
            style={{ width: window.innerWidth < 768 ? "35px" : "40px" }}
          />
        </span>
      );
    default:
      return <span>{truncate(name)}</span>;
  }
}

export function textWithImage(name) {
  let substrIndex, updatedName;

  switch (true) {
    case name.includes("BREAK"):
      substrIndex = name.indexOf("BREAK");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image src={Icon.breaklogo} alt="BREAK" style={{ width: "140px" }} />
        </span>
      );
    case name.includes("-GX"):
      substrIndex = name.indexOf("-GX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image src={Icon.gx} alt="GX" style={{ width: "70px" }} />
        </span>
      );
    case name.includes("ex") && name !== "Toxapex":
      substrIndex = name.indexOf("ex");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.ex}
            alt="ex"
            style={{ width: window.innerWidth < 768 ? "45px" : "70px" }}
          />
        </span>
      );
    case name.includes("-EX"):
      substrIndex = name.indexOf("-EX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.exOld}
            alt="EX"
            style={{ width: window.innerWidth < 768 ? "50px" : "65px" }}
          />
        </span>
      );
    case name.includes(" V") &&
      !name.includes("VMAX") &&
      !name.includes("VSTAR"):
      substrIndex = name.lastIndexOf("V");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.v}
            alt="V"
            style={{ width: window.innerWidth < 768 ? "40px" : "50px" }}
          />
        </span>
      );
    case name.includes("VMAX"):
      substrIndex = name.indexOf("VMAX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.vmax}
            alt="VMAX"
            style={{ width: window.innerWidth < 768 ? "60px" : "75px" }}
          />
        </span>
      );
    case name.includes("VSTAR"):
      substrIndex = name.indexOf("VSTAR");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.vstar}
            alt="VSTAR"
            style={{ width: window.innerWidth < 768 ? "60px" : "80px" }}
          />
        </span>
      );
    default:
      return <span>{name}</span>;
  }
}

export const updateCollection = async (userId, card, collectionOrWishlist) => {
  const auth = getAuth();

  console.log("collectionOrWishlist: ", collectionOrWishlist);

  try {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("writing collection...");
        const db = getDatabase();
        const collectionRef = ref(
          db,
          "users/" + userId + "/" + collectionOrWishlist
        );

        get(collectionRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const currentCollection = snapshot.val();

              const updatedCollection = currentCollection
                ? [...currentCollection, card]
                : [card];

              set(collectionRef, updatedCollection)
                .then(() => {
                  sessionStorage.setItem(
                    "session" +
                      collectionOrWishlist.charAt(0).toUpperCase() +
                      collectionOrWishlist.slice(1),
                    JSON.stringify(updatedCollection)
                  );
                  console.log("Card added to collection successfully!");
                })
                .catch((error) => {
                  console.error("Error adding card to collection:", error);
                });
            } else {
              // If collection doesn't exist yet, create a new one with the new card
              set(collectionRef, [card])
                .then(() => {
                  console.log("Collection created with the new card!");
                })
                .catch((error) => {
                  console.error("Error creating collection:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error fetching collection:", error);
          });
      }
    });
  } catch (error) {
    console.error(error);
  }

  console.log("done!");
};

export const cardAdded = (collectionOrWishlist) =>
  toast(
    <div>
      <span className="d-flex align-items-center justify-content-center">
        Card successfully added!
      </span>
      {collectionOrWishlist === "collection" ? (
        <Link
          to="/collection"
          className="d-flex align-items-center justify-content-center mt-2"
        >
          View collection
        </Link>
      ) : (
        <Link
          to="/wishlist"
          className="d-flex align-items-center justify-content-center mt-2"
        >
          View wishlist
        </Link>
      )}
    </div>,
    {}
  );

export const errorUploadingFile = () =>
  toast(
    <div>
      <span className="d-flex align-items-center justify-content-center">
        Error uploading image.
      </span>
    </div>,
    {}
  );

export const errorChangingUsername = () =>
  toast(
    <div>
      <span className="d-flex align-items-center justify-content-center">
        Error changing username.
      </span>
    </div>,
    {}
  );

export const errorTryAgain = () =>
  toast(
    <div>
      <span className="d-flex align-items-center justify-content-center">
        Error, please try again.
      </span>
    </div>,
    {}
  );

export const errorNotImage = () =>
  toast(
    <div>
      <span className="d-flex align-items-center justify-content-center">
        Error, only image files are allowed.
      </span>
    </div>,
    {}
  );

export const profileImageUpdated = () =>
  toast(
    <div>
      <span className="d-flex align-items-center justify-content-center">
        Profile image updated successfully!
      </span>
    </div>,
    {}
  );

export const usernameUpdated = () =>
  toast(
    <div>
      <span className="d-flex align-items-center justify-content-center">
        Username updated successfully!
      </span>
    </div>,
    {}
  );

export const sortByDate = (collection) => {
  return collection.sort((a, b) => {
    const firstDate = new Date(a.dateAddedToCollection);
    const secondDate = new Date(b.dateAddedToCollection);
    return firstDate - secondDate;
  });
};

export const sortByAlpha = (collection) => {
  return collection?.slice().sort((a, b) => {
    const firstVal = a.name.toUpperCase();
    const secondVal = b.name.toUpperCase();

    if (firstVal > secondVal) {
      return 1;
    }
    if (firstVal < secondVal) {
      return -1;
    }

    return 0;
  });
};

export const sortByPrice = (collection) => {
  return collection?.slice().sort((a, b) => {
    const firstVal =
      a.tcgplayer?.prices?.holofoil?.market ||
      a.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
      a.tcgplayer?.prices?.reverseHolofoil?.market ||
      a.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
      a.tcgplayer?.prices?.normal?.market ||
      null;
    const secondVal =
      b.tcgplayer?.prices?.holofoil?.market ||
      b.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
      b.tcgplayer?.prices?.reverseHolofoil?.market ||
      b.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
      b.tcgplayer?.prices?.normal?.market ||
      null;

    if (firstVal === null && secondVal !== null) return 1;
    if (firstVal !== null && secondVal === null) return -1;
    if (firstVal > secondVal) return -1;
    if (firstVal < secondVal) return 1;

    return 0;
  });
};

export function hasEightCharsOrMore(password) {
  const lengthRegex = /.{8,}/;

  return lengthRegex.test(password);
}

export function hasSpecialChar(password) {
  const specialCharRegex = /[!@#$%^&*()_+{}[\]:;<>,.?/~\\-]/;

  return specialCharRegex.test(password);
}

export function hasCapitalLetter(password) {
  const capitalLetterRegex = /[A-Z]/;

  return capitalLetterRegex.test(password);
}

export function hasNumber(password) {
  const numberRegex = /[0-9]/;

  return numberRegex.test(password);
}

// Truncate item name if more than 13 characters
export function truncate(name) {
  let truncatedName;

  if (name?.length > 13) {
    // truncate to 13 characters and "..." at the end
    truncatedName = name.slice(0, 13) + "...";

    return truncatedName;
  }

  return name;
}

// transform price type (holofoil, 1st edition, reverse holofoil etc) from camel case to normal
export function formatType(type) {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function formatDate(originalDate) {
  const parts = originalDate.split("/");
  const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
  return formattedDate;
}
