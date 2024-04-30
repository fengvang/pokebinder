import { useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import * as MuiIcon from "./MuiIcons";
import { ToastContainer } from "react-toastify";
import { updateCollection, cardAdded } from "./Functions";

function IndividualPageTrainer() {
  const location = useLocation();
  const card = location.state.cardData;
  const currentUser = JSON.parse(localStorage.getItem("user"));

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

  const handleUpdateCollection = () => {
    updateCollection(currentUser.uid, card);
    cardAdded();
  };

  return (
    <Container style={{ marginBottom: "20px" }}>
      <ToastContainer
        position={window.innerWidth < 768 ? "bottom-center" : "top-center"}
        theme="dark"
      />
      {window.innerWidth < 576 ? (
        <Row style={{ marginTop: "25px" }}>
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-start"
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
        <Col xs="auto" md={5} className="individual-image-col">
          <div className="image-container">
            <Image
              className="individual-page-image"
              src={card.images.large}
              alt={card.name}
            />
            <div className="image-overlay" onClick={handleUpdateCollection}>
              Add to collection
              <MuiIcon.LibraryAddIcon style={{ marginLeft: "5px" }} />
            </div>
          </div>
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
            {card.hasOwnProperty("rules") ? (
              <div>
                <b>Rules: </b>
                {card.rules.map((rule, index) => (
                  <div className="list" key={index}>
                    <p>
                      <i>{rule.split(":")[0]}</i>
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
                  <b>Last Updated:</b>{" "}
                  <i>
                    {formattedDateString} from{" "}
                    <Link to="https://www.tcgplayer.com/" target="_blank">
                      TCGplayer
                    </Link>
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
              <i>No price data available</i>
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
