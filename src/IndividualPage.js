import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import * as MuiIcon from "./MuiIcons";
import * as TypeIcon from "./Icons";
import SearchForm from "./SearchForm";

function IndividualPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const card = location.state.cardData;
  const originalCardData = location.state.originalCardData;
  const type = location.state.filteredTypes;
  const subtype = location.state.filteredSubtypes;
  const prevURLPath = location.state.prevURL.path;
  const prevURLSearch = location.state.prevURL.search;

  let formattedDate = null;
  let options;
  let formattedDateString;

  if (card && card.tcgplayer && card.tcgplayer.updatedAt) {
    formattedDate = new Date(card.tcgplayer.updatedAt);
    options = { month: "short", day: "2-digit", year: "numeric" };
    formattedDateString = formattedDate.toLocaleDateString("en-US", options);
  }

  // transform price type from camel case to normal
  function formatType(type) {
    return type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  // scroll to top when page loads, for fix on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  function getTypeTextImgColor(type) {
    switch (type) {
      case "Colorless":
        return TypeIcon.colorless_text_color;
      case "Darkness":
        return TypeIcon.darkness_text_color;
      case "Dragon":
        return TypeIcon.dragon_text_color;
      case "Fairy":
        return TypeIcon.fairy_text_color;
      case "Fighting":
        return TypeIcon.fighting_text_color;
      case "Fire":
        return TypeIcon.fire_text_color;
      case "Grass":
        return TypeIcon.grass_text_color;
      case "Lightning":
        return TypeIcon.lightning_text_color;
      case "Metal":
        return TypeIcon.metal_text_color;
      case "Psychic":
        return TypeIcon.psychic_text_color;
      case "Water":
        return TypeIcon.water_text_color;
      default:
        return null;
    }
  }

  function getMultipleTypes(types) {
    return types.map((type, index) => (
      <img
        key={index}
        src={getTypeTextImgColor(type)}
        alt={type}
        style={{ paddingRight: "10px" }}
      />
    ));
  }

  const goBackOnePage = () => {
    navigate(`${prevURLPath}${prevURLSearch}`, {
      state: {
        cardData: originalCardData,
        filteredTypes: type,
        filteredSubtypes: subtype,
      },
    });
  };

  window.onpopstate = function (event) {
    navigate(`${prevURLPath}${prevURLSearch}`, {
      state: {
        cardData: originalCardData,
        filteredTypes: type,
        filteredSubtypes: subtype,
      },
    });
  };

  function openTCGPlayerMarket() {
    if (`${card?.tcgplayer.url}`) {
      window.open(`${card?.tcgplayer.url}`, "_blank");
    }
  }

  return (
    <Container style={{ marginBottom: "20px" }}>
      <SearchForm />
      <h1 className="d-flex align-items-center">
        {card.name} - {card.number}
        <img
          src={getTypeImg(card.types[0])}
          alt={card.types[0]}
          style={{ paddingLeft: "10px" }}
        />
      </h1>

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
                        <MuiIcon.DownIcon style={{ color: `var(--bs-red)` }} />
                        <i style={{ paddingLeft: "10px" }}>
                          {prices.low ? `$${prices.low.toFixed(2)}` : "- - -"}
                        </i>
                      </span>
                      <span className="d-flex align-items-center">
                        <MuiIcon.MarketIcon />
                        <i style={{ paddingLeft: "10px" }}>
                          {prices.market
                            ? `$${prices.market.toFixed(2)}`
                            : "- - -"}
                        </i>
                      </span>
                      <span className="d-flex align-items-center">
                        <MuiIcon.UpIcon style={{ color: `var(--bs-green)` }} />
                        <i style={{ paddingLeft: "10px" }}>
                          {prices.high ? `$${prices.high.toFixed(2)}` : "- - -"}
                        </i>
                      </span>
                      <span className="d-flex align-items-center launch-tcgplayer">
                        <MuiIcon.LaunchIcon onClick={openTCGPlayerMarket} />
                      </span>
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
                <span className="d-flex align-items-center launch-tcgplayer">
                  <MuiIcon.LaunchIcon onClick={openTCGPlayerMarket} />
                </span>
              </Col>
            </div>
          )}
        </Row>
      ) : (
        ""
      )}

      <Row>
        <Col xs="auto" md={5} className="individual-image-col">
          <img
            className="individual-page-image"
            src={card.images.large}
            alt={card.name}
          />
        </Col>
        <Col md={7} className="individual-card-info">
          <Row className="first-row">
            <h4>Card Description</h4>
            <div>
              <b>HP:</b> <i>{card.hp}</i>
            </div>
            <div>
              <b>Type(s):</b>{" "}
              <span className="mx-1">{getMultipleTypes(card.types)}</span>
            </div>
            <div>
              {card.hasOwnProperty("rules") ? (
                <div>
                  <b>Rules:</b>
                  {card.rules.map((rule, index) => (
                    <div className="list" key={index}>
                      <p>
                        <b>{rule.split(":")[0] + ":"}</b>
                        <i>{rule.split(":")[1]}</i>
                      </p>
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
                  <b>Ability:</b>
                  {card.abilities.map((ability, index) => (
                    <div className="list" key={index}>
                      <b>{ability.name}: </b>
                      <i>{ability.text}</i>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              <b>Attack(s) / (Name - Damage):</b>
              {card.attacks.map((attack, index) => (
                <div className="list" key={index}>
                  <b>
                    {getMultipleTypes(attack.cost)}
                    {attack.name}{" "}
                    {attack.damage !== "" ? `- ${attack.damage}` : ""}
                  </b>
                  <div className="list-2">
                    <i>{attack.text}</i>
                  </div>
                </div>
              ))}

              <div>
                {card.hasOwnProperty("weaknesses") ? (
                  <div>
                    <b>Weakness:</b>
                    {card.weaknesses.map((weakness, index) => (
                      <div className="list" key={index}>
                        <img
                          src={getTypeTextImgColor(weakness.type)}
                          alt={weakness.type}
                          style={{ paddingRight: "10px" }}
                        />
                        <span>{weakness.value}</span>
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
                    <b>Resistance:</b>
                    {card.resistances.map((resistance, index) => (
                      <div className="list" key={index}>
                        <img
                          src={getTypeTextImgColor(resistance.type)}
                          alt={resistance.type}
                          style={{ paddingRight: "10px" }}
                        />
                        <i>{resistance.value}</i>
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
                    <b>Retreat:</b>
                    <div className="list">
                      {getMultipleTypes(card.retreatCost)}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div>
                <b>Artist:</b> <i>{card.artist}</i>
              </div>
            </div>
          </Row>
        </Col>
      </Row>

      {window.innerWidth > 576 ? (
        <Row className="second-row" style={{ padding: "12px" }}>
          <Col xs="auto" md={5} className="individual-price-container">
            <h4>Current Prices</h4>
            <div style={{ marginBottom: "8px" }}>
              {card && card.tcgplayer && card.tcgplayer.updatedAt ? (
                <span>
                  <b>Last Updated:</b>{" "}
                  <i>
                    {formattedDateString} from{" "}
                    <a
                      href="https://www.tcgplayer.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      TCGplayer
                    </a>
                  </i>
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
                        <Col
                          xs={3}
                          className="d-flex align-items-center launch-tcgplayer"
                        >
                          <MuiIcon.LaunchIcon onClick={openTCGPlayerMarket} />
                        </Col>
                      </Row>
                    </div>
                  )
              )
            ) : (
              <i>No price data available</i>
            )}
          </Col>
          <Col md={7}></Col>
        </Row>
      ) : (
        ""
      )}

      {/* when clicked and if filtered, return to filtered state */}
      <Button className="button results-individual" onClick={goBackOnePage}>
        Go back
      </Button>
    </Container>
  );
}

export default IndividualPage;
