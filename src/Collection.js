import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, Form } from "react-bootstrap";

import { sortByAlpha, sortByPrice, collectionTextWithImage } from "./Functions";
import * as MuiIcon from "./MuiIcons";

function Collection() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [collection, setCollection] = useState(null);

  function getCollectionFromDB(setCollection) {
    const auth = getAuth();

    console.log("loading from DB");
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const db = getDatabase();
          const collectionRef = ref(db, `users/${user.uid}/collection`);
          onValue(
            collectionRef,
            (snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();

                sessionStorage.setItem(
                  "sessionCollection",
                  JSON.stringify(data)
                );

                setCollection([...data].reverse());
              } else {
                console.log("No data available");
              }
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  function sortCollection() {
    let sortedCollection;

    switch (localStorage.getItem("order")) {
      case "newest":
        sortedCollection = JSON.parse(
          sessionStorage.getItem("sessionCollection")
        );
        setCollection(sortedCollection.reverse());
        break;
      case "oldest":
        setCollection(JSON.parse(sessionStorage.getItem("sessionCollection")));
        break;
      case "name":
        sortedCollection = sortByAlpha(
          JSON.parse(sessionStorage.getItem("sessionCollection")).slice()
        );
        setCollection(sortedCollection);
        break;
      case "-name":
        sortedCollection = sortByAlpha(
          JSON.parse(sessionStorage.getItem("sessionCollection"))?.slice()
        ).reverse();
        setCollection(sortedCollection);
        break;
      case "-tcgplayer.prices.holofoil":
        sortedCollection = sortByPrice(
          JSON.parse(sessionStorage.getItem("sessionCollection"))?.slice()
        );
        setCollection(sortedCollection);
        break;
      case "tcgplayer.prices.holofoil":
        sortedCollection = sortByPrice(
          JSON.parse(sessionStorage.getItem("sessionCollection"))?.slice()
        ).reverse();
        setCollection(sortedCollection);
        break;
      default:
        sortedCollection = JSON.parse(
          sessionStorage.getItem("sessionCollection")
        );
        setCollection(sortedCollection.reverse());
    }
  }

  const collectionWorth = () => {
    let totalPrice = 0;

    Object.values(collection).forEach((item) => {
      if (
        !isNaN(item.tcgplayer?.prices?.holofoil?.market) ||
        !isNaN(item.tcgplayer?.prices?.["1stEditionHolofoil"]?.market) ||
        !isNaN(item.tcgplayer?.prices?.reverseHolofoil?.market) ||
        !isNaN(item.tcgplayer?.prices?.["1stEditionNormal"]?.market) ||
        !isNaN(item.tcgplayer?.prices?.normal?.market)
      ) {
        if (item.tcgplayer?.prices?.holofoil?.market) {
          totalPrice += item.tcgplayer?.prices?.holofoil?.market;
        } else if (item.tcgplayer?.prices?.normal?.market) {
          totalPrice += item.tcgplayer.prices.normal.market;
        } else if (item.tcgplayer?.prices?.reverseHolofoil?.market) {
          totalPrice += item.tcgplayer.prices.reverseHolofoil.market;
        } else if (item.tcgplayer?.prices?.["1stEditionHolofoil"]?.market) {
          totalPrice += item.tcgplayer.prices["1stEditionHolofoil"].market;
        } else if (item.tcgplayer?.prices?.["1stEditionNormal"]?.market) {
          totalPrice += item.tcgplayer.prices["1stEditionNormal"].market;
        }
      } else {
        return;
      }
    });

    return totalPrice.toFixed(2);
  };

  const handleCardClick = (clickedCard) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/pokémon-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    } else if (clickedCard.supertype === "Trainer") {
      navigate(`/trainer-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    } else if (clickedCard.supertype === "Energy") {
      navigate(`/energy-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    }
  };

  const handleSelectChange = async (event) => {
    const order = event.target.value;

    localStorage.setItem("order", order);

    sortCollection();
  };

  const removeCardFromCollection = (id, setCollection) => {
    const auth = getAuth();

    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const db = getDatabase();
          const collectionRef = ref(db, "users/" + user.uid + "/collection");

          get(collectionRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                const collectionOnDB = snapshot.val();

                const updatedCollection = Object.values(collectionOnDB).filter(
                  (item) => item.id !== id
                );
                let sortedUpdatedCollection;

                switch (localStorage.getItem("order")) {
                  case "newest":
                    sortedUpdatedCollection = updatedCollection.slice();
                    setCollection(sortedUpdatedCollection.reverse());
                    break;
                  case "oldest":
                    setCollection(updatedCollection.slice());
                    break;
                  case "name":
                    sortedUpdatedCollection = sortByAlpha(
                      updatedCollection.slice()
                    );
                    setCollection(sortedUpdatedCollection);
                    break;
                  case "-name":
                    sortedUpdatedCollection = sortByAlpha(
                      updatedCollection.slice()
                    );
                    setCollection(sortedUpdatedCollection.reverse());
                    break;
                  case "-tcgplayer.prices.holofoil":
                    sortedUpdatedCollection = sortByPrice(
                      updatedCollection.slice()
                    );
                    setCollection(sortedUpdatedCollection);
                    break;
                  case "tcgplayer.prices.holofoil":
                    sortedUpdatedCollection = sortByPrice(
                      updatedCollection.slice()
                    );
                    setCollection(sortedUpdatedCollection.reverse());
                    break;
                  default:
                    sortedUpdatedCollection = updatedCollection.slice();
                    setCollection(sortedUpdatedCollection.reverse());
                }

                // Update the collection in the database
                set(collectionRef, updatedCollection)
                  .then(() => {
                    // Set the updated collection to the state
                    setCollection(sortedUpdatedCollection);

                    sessionStorage.setItem(
                      "sessionCollection",
                      JSON.stringify(Object.values(updatedCollection))
                    );
                    console.log("Collection updated on DB.");
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.log("Permission denied");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("sessionCollection"))
      getCollectionFromDB(setCollection);
    else sortCollection();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      {currentUser ? (
        <>
          <div className="mt-5">
            {collection ? (
              <>
                <h1 style={{ fontFamily: "Josefin Sans" }}>
                  {currentUser.displayName}'s Binder
                </h1>
                <h5>
                  Collection worth: ${collectionWorth()} ({collection.length}{" "}
                  cards)
                </h5>
              </>
            ) : null}
          </div>

          <Form.Group className="mb-5">
            <Form.Label className="card-desc-small-text">Order by</Form.Label>
            <Form.Select
              aria-label="collection-card-list"
              style={{
                width: window.innerWidth < 576 ? "100%" : "200px",
              }}
              onChange={handleSelectChange}
              defaultValue={localStorage.getItem("order")}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="-tcgplayer.prices.holofoil">
                Market Price - Highest
              </option>
              <option value="tcgplayer.prices.holofoil">
                Market Price - Lowest
              </option>
            </Form.Select>
          </Form.Group>

          {collection?.length === 0 ? (
            <h5 className="d-flex align-items-center justify-content-center">
              Loading...
            </h5>
          ) : (
            collection?.map((card, index) => (
              <div key={index} className="collection-card-container">
                <MuiIcon.CloseIcon
                  className="card-collection-close-button"
                  style={{ color: "rgba(255,255,255,0.1)" }}
                  onClick={() =>
                    removeCardFromCollection(card.id, setCollection)
                  }
                />

                <span style={{ position: "relative", top: "-24px" }}>
                  {collectionTextWithImage(card.name)}
                </span>

                <Image
                  className="collection-card-image"
                  src={card.images.small}
                  alt={card.name}
                  onClick={() => handleCardClick(card)}
                  onLoad={(e) => e.target.classList.add("card-image-loaded")}
                />
                <div>
                  {card.tcgplayer?.prices?.holofoil?.market ||
                  card.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
                  card.tcgplayer?.prices?.reverseHolofoil?.market ||
                  card.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
                  card.tcgplayer?.prices?.normal?.market ? (
                    <>
                      $
                      {card.tcgplayer?.prices?.holofoil?.market.toFixed(2) ||
                        card.tcgplayer?.prices?.[
                          "1stEditionHolofoil"
                        ]?.market.toFixed(2) ||
                        card.tcgplayer?.prices?.reverseHolofoil?.market.toFixed(
                          2
                        ) ||
                        card.tcgplayer?.prices?.[
                          "1stEditionNormal"
                        ]?.market.toFixed(2) ||
                        card.tcgplayer?.prices?.normal?.market.toFixed(2)}
                    </>
                  ) : (
                    <span>No data</span>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <span>No cards in collection</span>
      )}
    </>
  );
}

export default Collection;
