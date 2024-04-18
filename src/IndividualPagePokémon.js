import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import * as MuiIcon from "./MuiIcons";
import * as TypeIcon from "./Icons";

function IndividualPagePokémon() {
  const location = useLocation();
  const navigate = useNavigate();
  const card = location.state.cardData;

  let formattedDate = null;
  let options;
  let formattedDateString;

  if (card && card.tcgplayer && card.tcgplayer.updatedAt) {
    formattedDate = new Date(card.tcgplayer.updatedAt);
    options = { month: "short", day: "2-digit", year: "numeric" };
    formattedDateString = formattedDate.toLocaleDateString("en-US", options);
  }

  // transform price type (holofoil, 1st edition, reverse holofoil etc) from camel case to normal
  function formatType(type) {
    return type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
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
      <img
        key={index}
        src={getTypeImg(type)}
        alt={type}
        style={{ paddingRight: "8px" }}
      />
    ));
  }

  const goBackOnePage = () => {
    navigate(-1);
  };

  function openTCGPlayerMarket() {
    if (`${card?.tcgplayer.url}`) {
      window.open(`${card?.tcgplayer.url}`, "_blank");
    }
  }

  // const searchCard = async () => {
  //   const pokemonName = card?.evolvesFrom;

  //   try {
  //     const response = await fetch("/search-card", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         query: {
  //           name: pokemonName,
  //           subtype: "",
  //           page: 1,
  //           pageSize: 32,
  //         },
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch end point");
  //     }

  //     const evolvesFromPokemon = await response.json();

  //     navigate(`/results?${pokemonName}`, {
  //       state: {
  //         prevURL: { path: location.pathname, search: location.search },
  //         cardData: evolvesFromPokemon,
  //         set: set,
  //         query: {
  //           name: pokemonName,
  //           subtype: "",
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <Container style={{ marginBottom: "20px" }}>
      {window.innerWidth < 576 ? (
        <Row style={{ marginTop: "25px" }}>
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-start"
          >
            <h1 className="d-flex align-items-center">
              {card.name}

              <img
                src={getTypeImg(card.types[0])}
                alt={card.types[0]}
                style={{ paddingLeft: "10px" }}
              />
            </h1>
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: "25px" }}>
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-start"
          >
            <h1 className="d-flex align-items-center">
              {card.name}
              <img
                src={getTypeImg(card.types[0])}
                alt={card.types[0]}
                style={{ paddingLeft: "10px" }}
              />
            </h1>
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
          <h4>Card Description</h4>

          <div>
            <b>Set: </b>
            <i>
              {card.set.name} - {card.set.series}
            </i>
          </div>

          <div>
            <b>HP: </b> <i>{card.hp}</i>
          </div>

          <div>
            <b>Type(s): </b>
            <span className="mx-1">{getMultipleTypes(card.types)}</span>
          </div>

          <div>
            {card.hasOwnProperty("rules") ? (
              <div>
                <b>Rules: </b>
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
                <b>Ability: </b>
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
            <b>Attack(s): </b>
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
                  <Col xs={7} md={5} className="d-flex justify-content-between">
                    <span>{attack.name}</span>
                    <span>
                      {attack.damage !== "" ? `${attack.damage}` : ""}
                    </span>
                  </Col>
                </Row>
                <Row style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  <i>{attack.text}</i>
                </Row>
              </Row>
            ))}

            <div>
              {card.hasOwnProperty("weaknesses") ? (
                <div>
                  <b>Weakness: </b>
                  {card.weaknesses.map((weakness, index) => (
                    <div className="list" key={index}>
                      <img
                        src={getTypeImg(weakness.type)}
                        alt={weakness.type}
                        style={{ paddingRight: "8px" }}
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
                  <b>Resistance: </b>
                  {card.resistances.map((resistance, index) => (
                    <div className="list" key={index}>
                      <img
                        src={getTypeImg(resistance.type)}
                        alt={resistance.type}
                        style={{ paddingRight: "8px" }}
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
                  <b>Retreat: </b>
                  <div className="list">
                    {getMultipleTypes(card.retreatCost)}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              <b>Artist: </b> <i>{card.artist}</i>
            </div>
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

export default IndividualPagePokémon;
