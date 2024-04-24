import { useNavigate } from "react-router-dom";
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { sortByAlpha, sortByPrice } from "./Functions";

function Collection() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const dbRef = ref(getDatabase());
  const [collection, setCollection] = useState([]);
  const [orderBy, setOrderBy] = useState("");

  function getCollectionFromDB() {
    const auth = getAuth();

    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          get(child(dbRef, `users/${currentUser.uid}/collection`))
            .then((snapshot) => {
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
                    setCollection(sortByAlpha(data, "name"));
                    break;
                  case "-name":
                    setCollection(sortByAlpha(data, "-name"));
                    break;
                  case "-tcgplayer.prices.holofoil":
                    setCollection(sortByPrice(data, "high"));
                    break;
                  case "tcgplayer.prices.holofoil":
                    setCollection(sortByPrice(data, "low"));
                    break;
                  default:
                    setCollection(data.reverse());
                }
              } else {
                console.log("No data available");
              }
            })
            .catch((error) => {
              console.error(error);
            });
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
    getCollectionFromDB();
    // eslint-disable-next-line
  }, [orderBy]);

  return (
    <Container>
      {currentUser ? (
        <>
          <Row className="my-5 d-flex align-items-center justify-content-center">
            {collection ? (
              <>
                <h1 style={{ fontFamily: "Josefin Sans" }}>
                  {currentUser.displayName}'s Binder
                </h1>
                <Row>
                  <h5>Collection worth: $ {collectionWorth()}</h5>
                </Row>
              </>
            ) : null}

            <Row id="card-results-count">
              <Form.Group>
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

              {collection?.length === 0 ? (
                <h5 className="my-3 d-flex align-items-center justify-content-center">
                  Collection is empty!
                </h5>
              ) : (
                collection?.map((card) => (
                  <Col key={card.id} className="px-0 card-image-col">
                    <Card.Img
                      className="card-image"
                      src={card.images.large}
                      alt={card.name}
                      style={{ width: "200px" }}
                      onClick={() => handleCardClick(card)}
                      onLoad={(e) =>
                        e.target.classList.add("card-image-loaded")
                      }
                    />
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
