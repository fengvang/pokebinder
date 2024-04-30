import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import * as Icon from "./Icons";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";

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

export const updateCollection = (userId, card) => {
  const auth = getAuth();

  try {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("writing collection...");
        const db = getDatabase();
        const collectionRef = ref(db, "users/" + userId + "/collection");

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
                    "sessionCollection",
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

export const cardAdded = () =>
  toast("Card successfully added to collection", {});

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

export const fetchAllCards = async () => {
  try {
    const allCards = [];
    const pageSize = 250; // Number of cards per page

    let totalCount = 0;
    let currentPage = 1;
    let totalPages = 1; // Initial value

    console.log("fetching page", currentPage);

    do {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?page=${currentPage}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data from page ${currentPage}`);
      }

      const data = await response.json();

      // Update total count and calculate total pages on the first iteration
      if (currentPage === 1) {
        totalCount = data.totalCount;
        totalPages = Math.ceil(totalCount / pageSize);
      }

      allCards.push(...data.data);

      currentPage++;
      console.log("fetching page", currentPage);
    } while (currentPage <= totalPages);

    sessionStorage.setItem("allCards", JSON.stringify(allCards));

    return allCards;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
