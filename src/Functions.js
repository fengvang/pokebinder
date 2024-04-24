import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    console.log(error);
  }

  console.log("done!");
};

export const sortByAlpha = (collection, order) => {
  if (order === "name") {
    return collection.slice().sort((a, b) => {
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
  } else {
    return collection.slice().sort((a, b) => {
      const firstVal = a.name.toUpperCase();
      const secondVal = b.name.toUpperCase();

      if (firstVal > secondVal) {
        return -1;
      }
      if (firstVal < secondVal) {
        return 1;
      }

      return 0;
    });
  }
};

export const sortByPrice = (collection, sortBy) => {
  if (sortBy === "high") {
    return collection.slice().sort((a, b) => {
      const firstVal =
        a.tcgplayer?.prices?.holofoil?.market ||
        a.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
        a.tcgplayer?.prices?.reverseHolofoil?.market ||
        a.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
        a.tcgplayer?.prices?.normal?.market;
      const secondVal =
        b.tcgplayer?.prices?.holofoil?.market ||
        b.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
        b.tcgplayer?.prices?.reverseHolofoil?.market ||
        b.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
        b.tcgplayer?.prices?.normal?.market;

      if (firstVal > secondVal) {
        return -1;
      }
      if (firstVal < secondVal) {
        return 1;
      }

      return 0;
    });
  } else {
    return collection.slice().sort((a, b) => {
      const firstVal =
        a.tcgplayer?.prices?.holofoil?.market ||
        a.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
        a.tcgplayer?.prices?.reverseHolofoil?.market ||
        a.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
        a.tcgplayer?.prices?.normal?.market;
      const secondVal =
        b.tcgplayer?.prices?.holofoil?.market ||
        b.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
        b.tcgplayer?.prices?.reverseHolofoil?.market ||
        b.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
        b.tcgplayer?.prices?.normal?.market;

      if (firstVal > secondVal) {
        return 1;
      }
      if (firstVal < secondVal) {
        return -1;
      }

      return 0;
    });
  }
};
