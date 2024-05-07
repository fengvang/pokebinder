import { useLocation, useNavigate, Link } from "react-router-dom";
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
import { useEffect, useState } from "react";
import * as MuiIcon from "./MuiIcons";
import * as TypeIcon from "./Icons";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  textWithImage,
  updateCollection,
  cardAdded,
  formatType,
} from "./Functions";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function IndividualPagePokémon() {
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

  function getTypeImg(type) {
    switch (type) {
      case "Colorless":
        return TypeIcon.colorless;
      case "Darkness":
        return TypeIcon.darkness;
      case "Dragon":
        return TypeIcon.dragon;
      case "Fairy":
        return TypeIcon.fairy;
      case "Fighting":
        return TypeIcon.fighting;
      case "Fire":
        return TypeIcon.fire;
      case "Grass":
        return TypeIcon.grass;
      case "Lightning":
        return TypeIcon.lightning;
      case "Metal":
        return TypeIcon.metal;
      case "Psychic":
        return TypeIcon.psychic;
      case "Water":
        return TypeIcon.water;
      default:
        return null;
    }
  }

  function getMultipleTypes(types) {
    return types.map((type, index) => (
      <Image
        key={index}
        src={getTypeImg(type)}
        alt={type}
        style={{
          marginRight: "6px",
          width: "25px",
          height: "25px",
        }}
        roundedCircle
      />
    ));
  }

  const handleEvolveClick = async (pokemonName) => {
    localStorage.setItem("pokemonName", pokemonName);
    localStorage.setItem("pokemonSubtype", "All");
    try {
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/search-card",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              name: pokemonName,
              subtype: "",
              page: 1,
              pageSize: 36,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }

      const evolvesFromPokemon = await response.json();

      navigate(`/results?${pokemonName}&page=1`, {
        state: {
          cardData: evolvesFromPokemon,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      {window.innerWidth < 768 ? (
        <Row
          style={{ marginTop: "25px" }}
          className="d-flex align-items-center justify-content-center"
        >
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-center"
          >
            <h1 className="d-flex align-items-center">
              {textWithImage(card.name)}
            </h1>
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: "25px" }}>
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-center mb-5"
          >
            <h1 className="d-flex align-items-center">
              {textWithImage(card.name)}
            </h1>
          </Col>
        </Row>
      )}

      {window.innerWidth < 576 || window.innerWidth < 768 ? (
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
            <b>Set </b>
            <span className="card-desc-small-text">
              {card.set.series} -{" "}
              <span className="span-link" onClick={handleSetClicked}>
                {card.set.name}
              </span>
            </span>
          </div>

          <div>
            <b>HP </b> <span className="card-desc-small-text">{card.hp}</span>
          </div>

          <div>
            {card.hasOwnProperty("evolvesFrom") ? (
              <>
                <b>Evolves from </b>{" "}
                <span
                  className="card-desc-small-text span-link"
                  onClick={() => handleEvolveClick(card.evolvesFrom)}
                >
                  {card.evolvesFrom}
                </span>
              </>
            ) : null}
          </div>

          <div>
            {card.hasOwnProperty("evolvesTo") && card.evolvesTo.length > 0 ? (
              <>
                <b>Evolves to </b>{" "}
                {card.evolvesTo.map((evolution, index) => (
                  <span
                    key={index}
                    className="card-desc-small-text"
                    onClick={() => handleEvolveClick(evolution)}
                  >
                    {index > 0 ? ", " : ""}
                    <span className="span-link">{evolution}</span>
                  </span>
                ))}
              </>
            ) : null}
          </div>

          <div>
            <b>Type(s) </b>
            <span className="mx-1">{getMultipleTypes(card.types)}</span>
          </div>

          <div>
            {card.hasOwnProperty("abilities") ? (
              <div>
                <Image
                  src={TypeIcon.ability}
                  alt="Ability"
                  style={{ width: "130px", marginRight: "20px" }}
                />
                {card.abilities.map((ability, index) => (
                  <>
                    <b>{ability.name}</b>
                    <div className="list" key={index}>
                      <span className="card-desc-small-text">
                        {ability.text}
                      </span>
                    </div>
                  </>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>

          <div>
            <b>Attack(s) </b>
            {card.attacks.map((attack, index) => (
              <Row className="list" key={index}>
                <Row>
                  <Col
                    xs={5}
                    md={5}
                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                  >
                    {getMultipleTypes(attack.cost)}
                  </Col>
                  <Col
                    xs={7}
                    md={5}
                    className="d-flex justify-content-between my-1"
                  >
                    <span>
                      <b>{attack.name}</b>
                    </span>
                    <span>
                      {attack.damage !== "" ? `${attack.damage}` : ""}
                    </span>
                  </Col>
                </Row>
                <Row
                  style={{
                    paddingLeft: "0px",
                    paddingRight: "0px",
                  }}
                  className="card-desc-small-text"
                >
                  {attack.text}
                </Row>
              </Row>
            ))}

            <div>
              {card.hasOwnProperty("weaknesses") ? (
                <div>
                  <b>Weakness </b>
                  {card.weaknesses.map((weakness, index) => (
                    <div className="list" key={index}>
                      <Image
                        src={getTypeImg(weakness.type)}
                        alt={weakness.type}
                        style={{
                          marginRight: "8px",
                        }}
                        roundedCircle
                      />
                      <span className="card-desc-small-text">
                        {weakness.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              {card.hasOwnProperty("resistances") ? (
                <div>
                  <b>Resistance </b>
                  {card.resistances.map((resistance, index) => (
                    <div className="list" key={index}>
                      <Image
                        src={getTypeImg(resistance.type)}
                        alt={resistance.type}
                        style={{
                          marginRight: "8px",
                        }}
                        roundedCircle
                      />
                      <span className="card-desc-small-text">
                        {resistance.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              {card.hasOwnProperty("retreatCost") ? (
                <div>
                  <b>Retreat </b>
                  <div className="list">
                    {getMultipleTypes(card.retreatCost)}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              {card.hasOwnProperty("rules") ? (
                <div>
                  <b>Rules </b>
                  {card.rules.map((rule, index) => (
                    <div className="list" key={index}>
                      <p>
                        <span className="card-desc-small-text">
                          <b>{rule.split(":")[0] + ":"}</b>
                          {rule.split(":")[1]}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              <b>Artist: </b>{" "}
              <span className="card-desc-small-text">{card.artist}</span>
            </div>
          </div>
        </Col>
      </Row>

      {window.innerWidth > 768 ? (
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
                          <span style={{ paddingLeft: "10px" }}>
                            {prices.low ? `$${prices.low.toFixed(2)}` : "- - -"}
                          </span>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center">
                          <MuiIcon.MarketIcon />
                          <span style={{ paddingLeft: "10px" }}>
                            {prices.market
                              ? `$${prices.market.toFixed(2)}`
                              : "- - -"}
                          </span>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center">
                          <MuiIcon.UpIcon
                            style={{ color: `var(--bs-green)` }}
                          />
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
              <>No price data available</>
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

export default IndividualPagePokémon;
