import { useAuth0 } from "@auth0/auth0-react";
import { getDatabase, ref, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

function Collection() {
  const { user, isAuthenticated } = useAuth0();
  const userId = user?.sub;
  const navigate = useNavigate();
  const collection = JSON.parse(localStorage.getItem(`myCollection_${userId}`));

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

  function myCollectionExists() {
    return localStorage.getItem(`myCollection_${userId}`);
  }

  let data = myCollectionExists
    ? JSON.parse(localStorage.getItem(`myCollection_${userId}`))
    : [];
  let cards = {
    data: data,
    page: 1,
    pageSize: 36,
    count: data?.length,
    totalCount: data?.length,
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

  function updateCollection(userId, collection) {
    console.log("writing collection...");
    const db = getDatabase();
    update(ref(db, "users/" + userId), {
      collection: collection,
    });
    console.log("done!");
  }

  useEffect(() => {
    updateCollection(user?.sub, collection);
  }, [isAuthenticated, user, collection]);

  return (
    <Container>
      {isAuthenticated ? (
        <>
          <Row className="my-5">
            {myCollectionExists() ? (
              <>
                <Row>
                  <h5>Collection worth: $ {collectionWorth()}</h5>
                </Row>
              </>
            ) : null}

            <Row id="card-results-count">
              {cards?.length === 0 ? (
                <h5 className="my-3 d-flex align-items-center justify-content-center">
                  Collection is empty!
                </h5>
              ) : (
                cards?.data?.map((card) => (
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
