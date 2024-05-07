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

function IndividualPageTrainer() {
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

  const handleUpdateCollection = () => {
    const dateAddedToCollection = new Date().toISOString();

    updateCollection(currentUser.uid, {
      ...card,
      cardCollectionType:
        cardCollectionType !== "" ? cardCollectionType : "null",
      dateAddedToCollection,
    });

    cardAdded();
  };

  const handlePriceTypeChange = (event) => {
    setCardCollectionType(event.target.value);
  };

  const handleSetClicked = async () => {
    const set = location.state.setData;
    const setData = sessionStorage.getItem(`${set.id}`);

    if (!setData) {
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
                setID: set.id,
                page: 1,
                pageSize: 36,
              },
            }),
          }
        );

        const data = await response.json();

        sessionStorage.setItem(`${set.id}`, JSON.stringify(data));

        navigate(`/browse-by-set?${set.series}-${set.name}&page=1`, {
          state: {
            set: set,
            setData: data,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch end point");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      navigate(`/browse-by-set?${set.series}-${set.name}&page=1`, {
        state: {
          set: set,
          setData: JSON.parse(setData),
        },
      });
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
                          {prices.high ? `$${prices.high.toFixed(2)}` : "- - -"}
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
                  <i style={{ paddingLeft: "10px" }}>- - -</i>
                </span>
                <span className="d-flex align-items-center">
                  <MuiIcon.MarketIcon />
                  <i style={{ paddingLeft: "10px" }}>- - -</i>
                </span>
                <span className="d-flex align-items-center">
                  <MuiIcon.UpIcon style={{ color: `var(--bs-green)` }} />
                  <i style={{ paddingLeft: "10px" }}>- - -</i>
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
            {currentUser ? (
              card.tcgplayer?.prices &&
              Object.keys(card.tcgplayer?.prices).length > 1 ? (
                <>
                  <Popup
                    trigger={
                      <div
                        className="image-overlay"
                        onClick={handleUpdateCollection}
                      >
                        Add to collection
                        <MuiIcon.LibraryAddIcon style={{ marginLeft: "5px" }} />
                      </div>
                    }
                    modal
                  >
                    <div className="modal-header">Which variant?</div>
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
                        className="add-to-collection"
                        onClick={handleUpdateCollection}
                      >
                        Add to collection
                      </Button>
                    </div>
                  </Popup>
                </>
              ) : (
                <>
                  <div
                    className="image-overlay"
                    onClick={handleUpdateCollection}
                  >
                    Add to collection
                    <MuiIcon.LibraryAddIcon style={{ marginLeft: "5px" }} />
                  </div>
                </>
              )
            ) : (
              <Link to="/login">
                <div className="image-overlay" style={{ color: "#ffffff" }}>
                  Log in to track collection
                </div>
              </Link>
            )}
          </div>
        </Col>

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
            {card.hasOwnProperty("rules") ? (
              <div>
                <b>Rules: </b>
                {card.rules.map((rule, index) => (
                  <div className="list" key={index}>
                    <p>{rule.split(":")[0]}</p>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>

          <div>
            {card.hasOwnProperty("abilities") ? (
              <div>
                <b>Ability: </b>
                {card.abilities.map((ability, index) => (
                  <div className="list" key={index}>
                    <b>{ability.name}: </b>
                    {ability.text}
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>

          <div>
            <b>Artist: </b> <i>{card.artist}</i>
          </div>
        </Col>
      </Row>

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
                          <MuiIcon.DownIcon
                            style={{ color: `var(--bs-red)` }}
                          />
                          <i style={{ paddingLeft: "10px" }}>
                            {prices.low ? `$${prices.low.toFixed(2)}` : "- - -"}
                          </i>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center">
                          <MuiIcon.MarketIcon />
                          <i style={{ paddingLeft: "10px" }}>
                            {prices.market
                              ? `$${prices.market.toFixed(2)}`
                              : "- - -"}
                          </i>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center">
                          <MuiIcon.UpIcon
                            style={{ color: `var(--bs-green)` }}
                          />
                          <i style={{ paddingLeft: "10px" }}>
                            {prices.high
                              ? `$${prices.high.toFixed(2)}`
                              : "- - -"}
                          </i>
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

export default IndividualPageTrainer;
