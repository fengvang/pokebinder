import { useNavigate, Link } from "react-router-dom";
import { getDatabase, ref, onValue, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, Form, Row, Col, Button } from "react-bootstrap";
import SyncLoader from "react-spinners/SyncLoader";

import {
  sortByAlpha,
  sortByPrice,
  wishlistTextWithImage,
  sortByDate,
  formatISODate,
} from "./Functions";
import * as MuiIcon from "./MuiIcons";

function Wishlist2() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [collection, setCollection] = useState(null);
  const [isLoading, setLoading] = useState(false);

  function getCollectionFromDB(setCollection) {
    const auth = getAuth();
    setLoading(true);

    // console.log("loading from DB");
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const db = getDatabase();
          const collectionRef = ref(db, `users/${user.uid}/wishlist`);
          onValue(
            collectionRef,
            (snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();

                sessionStorage.setItem("sessionWishlist", JSON.stringify(data));

                setCollection([...data].reverse());

                if (localStorage.getItem("order")) {
                  sortCollection();
                }
              } else {
                setLoading(false);
                // console.log("No data available");
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
    } finally {
      setLoading(false);
    }
  }

  function sortCollection() {
    let sortedCollection;

    switch (localStorage.getItem("order")) {
      case "newest":
        sortedCollection = sortByDate(
          JSON.parse(sessionStorage.getItem("sessionWishlist"))
        );
        setCollection(sortedCollection.reverse());
        break;
      case "oldest":
        setCollection(
          sortByDate(JSON.parse(sessionStorage.getItem("sessionWishlist")))
        );
        break;
      case "name":
        sortedCollection = sortByAlpha(
          JSON.parse(sessionStorage.getItem("sessionWishlist")).slice()
        );
        setCollection(sortedCollection);
        break;
      case "-name":
        sortedCollection = sortByAlpha(
          JSON.parse(sessionStorage.getItem("sessionWishlist"))?.slice()
        ).reverse();
        setCollection(sortedCollection);
        break;
      case "-tcgplayer.prices.holofoil":
        sortedCollection = sortByPrice(
          JSON.parse(sessionStorage.getItem("sessionWishlist"))?.slice()
        );
        setCollection(sortedCollection);
        break;
      case "tcgplayer.prices.holofoil":
        sortedCollection = sortByPrice(
          JSON.parse(sessionStorage.getItem("sessionWishlist"))?.slice()
        ).reverse();
        setCollection(sortedCollection);
        break;
      default:
        sortedCollection = sortByDate(
          JSON.parse(sessionStorage.getItem("sessionWishlist"))
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

  const removeCardFromCollection = (index, setCollection) => {
    const auth = getAuth();

    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const db = getDatabase();
          const collectionRef = ref(db, "users/" + user.uid + "/wishlist");

          get(collectionRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                const collectionOnDB = snapshot.val();

                // sort db collection and remove index and sort back by date to store in db (keep track of order added)

                let tempCollectionOnDB;

                switch (localStorage.getItem("order")) {
                  case "newest":
                    tempCollectionOnDB = sortByDate(collectionOnDB.slice());
                    setCollection(tempCollectionOnDB.reverse());
                    break;
                  case "oldest":
                    tempCollectionOnDB = collectionOnDB.slice();
                    setCollection(collectionOnDB);
                    break;
                  case "name":
                    tempCollectionOnDB = sortByAlpha(collectionOnDB.slice());
                    setCollection(tempCollectionOnDB);
                    break;
                  case "-name":
                    tempCollectionOnDB = sortByAlpha(collectionOnDB.slice());
                    setCollection(tempCollectionOnDB.reverse());
                    break;
                  case "-tcgplayer.prices.holofoil":
                    tempCollectionOnDB = sortByPrice(collectionOnDB.slice());
                    setCollection(tempCollectionOnDB);
                    break;
                  case "tcgplayer.prices.holofoil":
                    tempCollectionOnDB = sortByPrice(collectionOnDB.slice());
                    setCollection(tempCollectionOnDB.reverse());
                    break;
                  default:
                    tempCollectionOnDB = sortByDate(collectionOnDB.slice());
                    setCollection(tempCollectionOnDB.reverse());
                }

                // Remove index from array
                tempCollectionOnDB.splice(index, 1);

                // Sort back from oldest to newest
                const sortedTempCollectionOnDB = sortByDate(
                  tempCollectionOnDB.slice()
                );

                // Update the collection in the database
                set(collectionRef, sortedTempCollectionOnDB)
                  .then(() => {
                    // Set the updated collection to the state
                    setCollection(tempCollectionOnDB.slice());

                    sessionStorage.setItem(
                      "sessionWishlist",
                      JSON.stringify(Object.values(sortedTempCollectionOnDB))
                    );

                    if (sortedTempCollectionOnDB.length === 0)
                      sessionStorage.removeItem("sessionWishlist");
                    // console.log("Collection updated on DB.");
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
          console.error("Permission denied");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCollectionFromDB(setCollection);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("sessionWishlist"))
      getCollectionFromDB(setCollection);
    else sortCollection();

    // eslint-disable-next-line
  }, [sessionStorage.getItem("sessionWishlist")]);

  useEffect(() => {
    document.title = `Pokébinder - ${currentUser.displayName}'s Wishlist`;

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
                  {currentUser.displayName}'s Wishlist
                </h1>
                <h5>
                  Wishlist price: ${collectionWorth()} ({collection.length}{" "}
                  cards)
                </h5>

                <Form.Group className="mb-5">
                  <Form.Label className="card-desc-small-text">
                    Order by
                  </Form.Label>
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
              </>
            ) : null}
          </div>

          <Row style={{ paddingLeft: "12px" }}>
            {isLoading ? (
              <h5 className="d-flex align-items-center justify-content-center">
                <SyncLoader
                  size={8}
                  color="#ffffff"
                  style={{ marginBottom: "25px" }}
                />
              </h5>
            ) : collection === null ? (
              <h5 className="d-flex align-items-center justify-content-center">
                Wishlist is empty!
              </h5>
            ) : (
              collection?.map((card, index) => (
                // not sitting at the same height
                <div key={index} className="wishlist-card-container">
                  <Image
                    className="wishlist-card-image"
                    src={card.images.small}
                    alt={card.name}
                    onClick={() => handleCardClick(card)}
                    onLoad={(e) => e.target.classList.add("card-image-loaded")}
                  />

                  <Col
                    style={{ marginLeft: "20px" }}
                    md={3}
                    className="mobile-card-wishlist-name"
                  >
                    <span style={{ fontSize: "1.25rem" }}>
                      {wishlistTextWithImage(card.name)}
                    </span>
                  </Col>

                  <Col
                    style={{ marginLeft: "20px" }}
                    md={3}
                    className="mobile-card-wishlist-price"
                  >
                    <div>
                      {card.tcgplayer?.prices?.holofoil?.market ||
                      card.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ||
                      card.tcgplayer?.prices?.reverseHolofoil?.market ||
                      card.tcgplayer?.prices?.["1stEditionNormal"]?.market ||
                      card.tcgplayer?.prices?.normal?.market ? (
                        <>
                          <span style={{ fontWeight: "bold" }}>
                            $
                            {card.tcgplayer?.prices?.holofoil?.market.toFixed(
                              2
                            ) ||
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
                          </span>
                        </>
                      ) : (
                        <span>No data</span>
                      )}
                    </div>
                  </Col>

                  {window.innerWidth < 576 ? (
                    <>
                      <Col
                        className="d-inline-flex flex-column align-items-start"
                        style={{ marginLeft: "15px", height: "100%" }}
                      >
                        <span style={{ fontSize: "1.25rem" }}>
                          {wishlistTextWithImage(card.name)}
                        </span>
                        <div>
                          {card.tcgplayer?.prices?.holofoil?.market ||
                          card.tcgplayer?.prices?.["1stEditionHolofoil"]
                            ?.market ||
                          card.tcgplayer?.prices?.reverseHolofoil?.market ||
                          card.tcgplayer?.prices?.["1stEditionNormal"]
                            ?.market ||
                          card.tcgplayer?.prices?.normal?.market ? (
                            <span style={{ fontWeight: "bold" }}>
                              $
                              {card.tcgplayer?.prices?.holofoil?.market.toFixed(
                                2
                              ) ||
                                card.tcgplayer?.prices?.[
                                  "1stEditionHolofoil"
                                ]?.market.toFixed(2) ||
                                card.tcgplayer?.prices?.reverseHolofoil?.market.toFixed(
                                  2
                                ) ||
                                card.tcgplayer?.prices?.[
                                  "1stEditionNormal"
                                ]?.market.toFixed(2) ||
                                card.tcgplayer?.prices?.normal?.market.toFixed(
                                  2
                                )}
                            </span>
                          ) : (
                            <span>No data</span>
                          )}
                        </div>

                        <span>
                          Added {formatISODate(card?.dateAddedToCollection)}
                        </span>

                        <div
                          className="d-flex align-items-end justify-content-between"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Link
                            to={card?.tcgplayer.url}
                            target="_blank"
                            className="launch-tcgplayer px-0 py-0"
                          >
                            <Button id="tcg-player-button">
                              Buy on TCG Player
                            </Button>
                          </Link>

                          <MuiIcon.DeleteIcon
                            onClick={() =>
                              removeCardFromCollection(index, setCollection)
                            }
                            className="card-wishlist-close-button"
                          />
                        </div>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col className="d-inline-flex flex-column align-items-center mobile-card-wishlist-functions">
                        <span className="mb-3">
                          <span>
                            Added {formatISODate(card?.dateAddedToCollection)}
                          </span>
                        </span>

                        <Link
                          to={card?.tcgplayer.url}
                          target="_blank"
                          className="launch-tcgplayer mb-3"
                        >
                          <Button id="tcg-player-button">
                            Buy on TCG Player
                          </Button>
                        </Link>

                        <div className="d-flex align-items-center justify-content-center">
                          <Button
                            id="tcg-player-button"
                            onClick={() =>
                              removeCardFromCollection(index, setCollection)
                            }
                          >
                            <MuiIcon.DeleteIcon className="card-wishlist-close-button" />{" "}
                            Remove
                          </Button>
                        </div>
                      </Col>
                    </>
                  )}
                </div>
              ))
            )}
          </Row>
        </>
      ) : (
        <span>No cards in wishlist</span>
      )}
    </>
  );
}

export default Wishlist2;
