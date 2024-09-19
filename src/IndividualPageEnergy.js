import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import * as MuiIcon from "./MuiIcons";
import { Slide, ToastContainer } from "react-toastify";
import { updateCollection, cardAdded, formatType } from "./Functions";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function IndividualPageEnergy() {
  const location = useLocation();
  const navigate = useNavigate();
  const card = location.state.cardData;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [cardCollectionType, setCardCollectionType] = useState(" ");

  let formattedDate = null;
  let options;
  let formattedDateString;

  if (card && card.tcgplayer && card.tcgplayer.updatedAt) {
    formattedDate = new Date(card.tcgplayer.updatedAt);
    options = { month: "short", day: "2-digit", year: "numeric" };
    formattedDateString = formattedDate.toLocaleDateString("en-US", options);
  }

  const handleUpdateCollection = (collectionOrWishlist) => {
    const dateAddedToCollection = new Date().toISOString();

    updateCollection(
      currentUser.uid,
      {
        ...card,
        cardCollectionType:
          cardCollectionType !== "" ? cardCollectionType : "null",
        dateAddedToCollection,
      },
      collectionOrWishlist
    );

    cardAdded(collectionOrWishlist);
  };

  const handlePriceTypeChange = (event) => {
    setCardCollectionType(event.target.value);
  };

  const handleSetClicked = async () => {
    try {
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-set-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              setID: card.set.id,
              page: 1,
              pageSize: 36,
            },
          }),
        }
      );

      const data = await response.json();

      sessionStorage.setItem(`${card.set.id}`, JSON.stringify(data));

      navigate(`/browse-by-set?${card.set.series}-${card.set.name}&page=1`, {
        state: {
          set: card.set,
          setData: data,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRarityCards = async (rarity) => {
    try {
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-rarity-cards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              rarity: rarity,
              page: 1,
              pageSize: 36,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }

      const data = await response.json();

      navigate(`/rarity?${rarity}&page=1`, {
        state: {
          cardData: data,
          rarity: rarity,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // console.log(cardCollectionType);
    if (
      cardCollectionType === " " &&
      card.tcgplayer?.hasOwnProperty("prices")
    ) {
      setCardCollectionType(Object.keys(card.tcgplayer?.prices)[0]);
      // console.log("setting to", Object.keys(card.tcgplayer?.prices)[0]);
    }
  }, [cardCollectionType, card]);

  useEffect(() => {
    document.title = `Pokébinder - ${card.name}`;

    // eslint-disable-next-line
  }, []);

  return (
    <Container style={{ marginBottom: "20px" }}>
      <ToastContainer
        position={window.innerWidth < 768 ? "bottom-center" : "top-center"}
        theme="dark"
        transition={Slide}
      />
      {window.innerWidth < 576 ? (
        <Row
          style={{ marginTop: "25px" }}
          className="d-flex align-items-center justify-content-center"
        >
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-center"
          >
            <h1 className="d-flex align-items-center">{card.name}</h1>
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: "25px" }}>
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-center mb-5"
          >
            <h1 className="d-flex align-items-center">{card.name}</h1>
          </Col>
        </Row>
      )}

      {window.innerWidth < 576 ? (
        <>
          <Row
            xs={12}
            className="d-flex align-items-center justify-content-center mt-3"
          >
            Updated on {formattedDateString}
          </Row>
          <Row xs={12}>
            {card && card.tcgplayer && card.tcgplayer.prices ? (
              Object.entries(card.tcgplayer.prices).map(
                ([type, prices], index) =>
                  index === 0 && (
                    <div
                      key={type}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Col
                        xs={10}
                        className="d-flex justify-content-between"
                        style={{ marginBottom: "8px" }}
                      >
                        <span className="d-flex align-items-center">
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id={"low"}>Low</Tooltip>}
                          >
                            <MuiIcon.DownIcon
                              style={{ color: `var(--bs-red)` }}
                            />
                          </OverlayTrigger>
                          <span style={{ paddingLeft: "10px" }}>
                            {prices.low ? `$${prices.low.toFixed(2)}` : "- - -"}
                          </span>
                        </span>
                        <span className="d-flex align-items-center">
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id={"market"}>Market</Tooltip>}
                          >
                            <MuiIcon.MarketIcon />
                          </OverlayTrigger>
                          <span style={{ paddingLeft: "10px" }}>
                            {prices.market
                              ? `$${prices.market.toFixed(2)}`
                              : "- - -"}
                          </span>
                        </span>
                        <span className="d-flex align-items-center">
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id={"high"}>High</Tooltip>}
                          >
                            <MuiIcon.UpIcon
                              style={{ color: `var(--bs-green)` }}
                            />
                          </OverlayTrigger>
                          <span style={{ paddingLeft: "10px" }}>
                            {prices.high
                              ? `$${prices.high.toFixed(2)}`
                              : "- - -"}
                          </span>
                        </span>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 250, hide: 400 }}
                          overlay={
                            <Tooltip id={"launch"}>See at TCGplayer</Tooltip>
                          }
                        >
                          <Link
                            to={card?.tcgplayer.url}
                            target="_blank"
                            className="launch-tcgplayer"
                          >
                            <span className="d-flex align-items-center">
                              <MuiIcon.LaunchIcon />
                            </span>
                          </Link>
                        </OverlayTrigger>
                      </Col>
                    </div>
                  )
              )
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <Col
                  xs={10}
                  className="d-flex justify-content-between"
                  style={{ marginBottom: "8px" }}
                >
                  <span className="d-flex align-items-center">
                    <MuiIcon.DownIcon style={{ color: `var(--bs-red)` }} />
                    <span style={{ paddingLeft: "10px" }}>- - -</span>
                  </span>
                  <span className="d-flex align-items-center">
                    <MuiIcon.MarketIcon />
                    <span style={{ paddingLeft: "10px" }}>- - -</span>
                  </span>
                  <span className="d-flex align-items-center">
                    <MuiIcon.UpIcon style={{ color: `var(--bs-green)` }} />
                    <span style={{ paddingLeft: "10px" }}>- - -</span>
                  </span>
                  <Link
                    to={card?.tcgplayer.url}
                    target="_blank"
                    className="launch-tcgplayer"
                  >
                    <span className="d-flex align-items-center">
                      <MuiIcon.LaunchIcon />
                    </span>
                  </Link>
                </Col>
              </div>
            )}
          </Row>
        </>
      ) : (
        ""
      )}

      <Row>
        <Col xs="auto" sm={12} md={5} className="individual-image-col">
          <div className="image-container">
            <Image
              className="individual-page-image"
              src={card.images.large}
              alt={card.name}
            />
          </div>
        </Col>

        {/* Mobile view */}
        {window.innerWidth > 768 ? null : (
          <div className="d-flex align-items-center justify-content-center mt-3">
            {currentUser ? (
              card.tcgplayer?.prices &&
              Object.keys(card.tcgplayer?.prices).length > 1 ? (
                <>
                  <Popup
                    trigger={
                      <Button className="mx-2 add-to-button">
                        <MuiIcon.LibraryAddIcon /> Add to wishlist
                      </Button>
                    }
                    modal
                  >
                    <div className="modal-header d-flex align-items-center justify-content-center">
                      Which variant?
                    </div>
                    <div className="modal-content">
                      {Object.keys(card.tcgplayer?.prices).map(
                        (priceType, index) => (
                          <Form.Check
                            key={index}
                            type="radio"
                            id={`priceType-${index}`}
                            label={formatType(priceType)}
                            value={priceType}
                            checked={cardCollectionType === priceType}
                            onChange={handlePriceTypeChange}
                          />
                        )
                      )}
                    </div>
                    <div className="mb-3 d-flex align-items-center justify-content-center">
                      <Button
                        className="add-to-button"
                        onClick={() => handleUpdateCollection("wishlist")}
                      >
                        Add to wishlist
                      </Button>
                    </div>
                  </Popup>

                  <Popup
                    trigger={
                      <Button className="mx-2 add-to-button">
                        <MuiIcon.FavoriteIcon /> Add to collection
                      </Button>
                    }
                    modal
                  >
                    <div className="modal-header d-flex align-items-center justify-content-center">
                      Which variant?
                    </div>
                    <div className="modal-content">
                      {Object.keys(card.tcgplayer?.prices).map(
                        (priceType, index) => (
                          <Form.Check
                            key={index}
                            type="radio"
                            id={`priceType-${index}`}
                            label={formatType(priceType)}
                            value={priceType}
                            checked={cardCollectionType === priceType}
                            onChange={handlePriceTypeChange}
                          />
                        )
                      )}
                    </div>
                    <div className="mb-3 d-flex align-items-center justify-content-center">
                      <Button
                        className="add-to-button"
                        onClick={() => handleUpdateCollection("collection")}
                      >
                        Add to collection
                      </Button>
                    </div>
                  </Popup>
                </>
              ) : (
                <>
                  <Button
                    className="mx-2 add-to-button"
                    onClick={() => handleUpdateCollection("wishlist")}
                  >
                    <MuiIcon.LibraryAddIcon />
                    Add to wishlist
                  </Button>

                  <Button
                    className="mx-2 add-to-button"
                    onClick={() => handleUpdateCollection("collection")}
                  >
                    <MuiIcon.FavoriteIcon /> Add to collection
                  </Button>
                </>
              )
            ) : (
              <span>
                Please
                <Link to="/login"> log in </Link>
                to track your collection.
              </span>
            )}
          </div>
        )}

        <Col md={7} className="individual-card-info">
          <h4>Card Description</h4>

          <div>
            <b>Set: </b>
            <span className="card-desc-small-text">
              {card.set.series} -{" "}
              <span className="span-link" onClick={handleSetClicked}>
                {card.set.name}
              </span>
            </span>
          </div>

          <div>
            <b>Number </b>
            <span className="card-desc-small-text">
              {card.number}/{card.set.printedTotal}
            </span>
          </div>

          <div>
            <b>Rarity </b>
            <span
              className="card-desc-small-text span-link"
              onClick={() => getRarityCards(card.rarity)}
            >
              {card.rarity}
            </span>
          </div>
        </Col>
      </Row>

      {window.innerWidth > 768 ? (
        <Row style={{ padding: "12px" }}>
          <Col
            xs="auto"
            md={5}
            className="d-flex justify-content-center align-items-center"
          >
            {currentUser ? (
              card.tcgplayer?.prices &&
              Object.keys(card.tcgplayer?.prices).length > 1 ? (
                <>
                  <Popup
                    trigger={
                      <Button className="mx-2 add-to-button">
                        <MuiIcon.LibraryAddIcon /> Add to wishlist
                      </Button>
                    }
                    modal
                  >
                    <div className="modal-header d-flex align-items-center justify-content-center">
                      Which variant?
                    </div>
                    <div className="modal-content">
                      {Object.keys(card.tcgplayer?.prices).map(
                        (priceType, index) => (
                          <Form.Check
                            key={index}
                            type="radio"
                            id={`priceType-${index}`}
                            label={formatType(priceType)}
                            value={priceType}
                            checked={cardCollectionType === priceType}
                            onChange={handlePriceTypeChange}
                          />
                        )
                      )}
                    </div>
                    <div className="mb-3 d-flex align-items-center justify-content-center">
                      <Button
                        className="add-to-button"
                        onClick={() => handleUpdateCollection("wishlist")}
                      >
                        Add to wishlist
                      </Button>
                    </div>
                  </Popup>

                  <Popup
                    trigger={
                      <Button className="mx-2 add-to-button">
                        <MuiIcon.FavoriteIcon /> Add to collection
                      </Button>
                    }
                    modal
                  >
                    <div className="modal-header d-flex align-items-center justify-content-center">
                      Which variant?
                    </div>
                    <div className="modal-content">
                      {Object.keys(card.tcgplayer?.prices).map(
                        (priceType, index) => (
                          <Form.Check
                            key={index}
                            type="radio"
                            id={`priceType-${index}`}
                            label={formatType(priceType)}
                            value={priceType}
                            checked={cardCollectionType === priceType}
                            onChange={handlePriceTypeChange}
                          />
                        )
                      )}
                    </div>
                    <div className="mb-3 d-flex align-items-center justify-content-center">
                      <Button
                        className="add-to-button"
                        onClick={() => handleUpdateCollection("collection")}
                      >
                        Add to collection
                      </Button>
                    </div>
                  </Popup>
                </>
              ) : (
                <>
                  <Button
                    className="mx-2 add-to-button"
                    onClick={() => handleUpdateCollection("wishlist")}
                  >
                    <MuiIcon.LibraryAddIcon />
                    Add to wishlist
                  </Button>

                  <Button
                    className="mx-2 add-to-button"
                    onClick={() => handleUpdateCollection("collection")}
                  >
                    <MuiIcon.FavoriteIcon /> Add to collection
                  </Button>
                </>
              )
            ) : (
              <span>
                Please
                <Link to="/login"> log in </Link>
                to track your collection.
              </span>
            )}
          </Col>
        </Row>
      ) : null}

      {window.innerWidth > 576 ? (
        <Row className="second-row" style={{ padding: "12px" }}>
          <Col xs="auto" md={5} className="individual-price-container">
            <h4>Current Prices</h4>
            <div style={{ marginBottom: "8px" }}>
              {card && card.tcgplayer && card.tcgplayer.updatedAt ? (
                <span>
                  <b>Last Updated:</b> {formattedDateString} from{" "}
                  <Link to="https://www.tcgplayer.com/" target="_blank">
                    TCGplayer
                  </Link>
                </span>
              ) : null}
            </div>

            {card && card.tcgplayer && card.tcgplayer.prices ? (
              Object.entries(card.tcgplayer.prices).map(
                ([type, prices], index) =>
                  index === 0 && (
                    <div key={type}>
                      <div>
                        <h5>{formatType(type)}:</h5>
                      </div>
                      <Row className="list price-list " md="auto">
                        <Col xs={3} className="d-flex align-items-center">
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id={"low"}>Low</Tooltip>}
                          >
                            <MuiIcon.DownIcon
                              style={{ color: `var(--bs-red)` }}
                            />
                          </OverlayTrigger>

                          <span style={{ paddingLeft: "10px" }}>
                            {prices.low ? `$${prices.low.toFixed(2)}` : "- - -"}
                          </span>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center">
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id={"low"}>Market</Tooltip>}
                          >
                            <MuiIcon.MarketIcon />
                          </OverlayTrigger>
                          <span style={{ paddingLeft: "10px" }}>
                            {prices.market
                              ? `$${prices.market.toFixed(2)}`
                              : "- - -"}
                          </span>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center">
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id={"low"}>High</Tooltip>}
                          >
                            <MuiIcon.UpIcon
                              style={{ color: `var(--bs-green)` }}
                            />
                          </OverlayTrigger>
                          <span style={{ paddingLeft: "10px" }}>
                            {prices.high
                              ? `$${prices.high.toFixed(2)}`
                              : "- - -"}
                          </span>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center">
                          <Link
                            to={card?.tcgplayer.url}
                            target="_blank"
                            className="launch-tcgplayer"
                          >
                            <MuiIcon.LaunchIcon />
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  )
              )
            ) : (
              <span>No price data available</span>
            )}
          </Col>
          <Col md={7}></Col>
        </Row>
      ) : (
        ""
      )}
    </Container>
  );
}

export default IndividualPageEnergy;
