import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import * as MuiIcon from "./MuiIcons";

function IndividualPageEnergy() {
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

  useEffect(() => {
    if (window.innerWidth < 576) {
      document.getElementById("title-row").style.display = "none";
      document.getElementById("caption-row").style.display = "none";
      document.getElementById("search-row").style.display = "none";
      document.getElementById("search-by-set-row").style.display = "none";
    }
  }, []);

  const goBackOnePage = () => {
    navigate(-1);
  };

  function openTCGPlayerMarket() {
    if (`${card?.tcgplayer.url}`) {
      window.open(`${card?.tcgplayer.url}`, "_blank");
    }
  }

  return (
    <Container style={{ marginBottom: "20px" }}>
      {window.innerWidth < 576 ? (
        <Row style={{ marginTop: "-35px" }}>
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-start"
          >
            <h1 className="d-flex align-items-center">{card.name}</h1>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col
            xs="auto"
            md={12}
            className="d-flex align-items-center justify-content-start"
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

export default IndividualPageEnergy;
