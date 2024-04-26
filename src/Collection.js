import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import {
  sortByAlpha,
  sortByPrice,
  collectionTextWithImage,
  removeCardFromCollection,
} from "./Functions";
import * as MuiIcon from "./MuiIcons";

function Collection() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [collection, setCollection] = useState([]);
  const [orderBy, setOrderBy] = useState("");

  function getCollectionFromDB(setCollection) {
    const auth = getAuth();

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

                switch (localStorage.getItem("order") || orderBy) {
                  case "newest":
                    setCollection(data.reverse());
                    break;
                  case "oldest":
                    setCollection(data);
                    break;
                  case "name":
                    setCollection(sortByAlpha(data));
                    break;
                  case "-name":
                    setCollection(sortByAlpha(data).reverse());
                    break;
                  case "-tcgplayer.prices.holofoil":
                    setCollection(sortByPrice(data));
                    break;
                  case "tcgplayer.prices.holofoil":
                    setCollection(sortByPrice(data).reverse());
                    break;
                  default:
                    setCollection(data.reverse());
                }
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
    setOrderBy(order);

    if (order !== "default") localStorage.setItem("order", order);
    else localStorage.removeItem("order");
  };

  useEffect(() => {
    getCollectionFromDB(setCollection);
    // eslint-disable-next-line
  }, [orderBy]);

  return (
    <Container id="collection-container">
      {currentUser ? (
        <>
          <Row className="mt-5 d-flex align-items-center justify-content-center">
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

            <Form.Group>
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

            <Row id="card-results-count" xs={2}>
              {collection?.length === 0 ? (
                <h5 className="my-3 d-flex align-items-center justify-content-center">
                  Collection is empty!
                </h5>
              ) : (
                collection?.map((card, index) => (
                  <Col key={index} className="px-0 card-image-col">
                    <Card className="collection-card-container">
                      <MuiIcon.CloseIcon
                        className="card-collection-close-button"
                        onClick={() => removeCardFromCollection(card.id)}
                      />

                      <Card.Title className="d-flex align-items-center justify-content-center">
                        {collectionTextWithImage(card.name)}
                      </Card.Title>

                      <Card.Img
                        className="card-image-collection"
                        src={card.images.large}
                        alt={card.name}
                        onClick={() => handleCardClick(card)}
                        onLoad={(e) =>
                          e.target.classList.add("card-image-loaded")
                        }
                      />
                      <Card.Body style={{ padding: "16px 16px 0px 16px" }}>
                        <Card.Text className="d-flex align-items-center justify-content-center">
                          {card.tcgplayer?.prices?.holofoil?.market ||
                          card.tcgplayer?.prices?.["1stEditionHolofoil"]
                            ?.market ||
                          card.tcgplayer?.prices?.reverseHolofoil?.market ||
                          card.tcgplayer?.prices?.["1stEditionNormal"]
                            ?.market ||
                          card.tcgplayer?.prices?.normal?.market ? (
                            <>
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
                            </>
                          ) : (
                            <span>No data</span>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Row>
        </>
      ) : (
        <span>Sorry please log in</span>
      )}
    </Container>
  );
}

export default Collection;
