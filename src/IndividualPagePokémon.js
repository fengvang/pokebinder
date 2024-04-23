import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { textWithImage } from "./TextWithImages";
import { useAuth0 } from "@auth0/auth0-react";
import { getDatabase, ref, update } from "firebase/database";
import { useEffect } from "react";
import * as MuiIcon from "./MuiIcons";
import * as TypeIcon from "./Icons";

function IndividualPagePokémon() {
  const location = useLocation();
  const navigate = useNavigate();
  const card = location.state.cardData;
  const { user, isAuthenticated } = useAuth0();
  const collection = JSON.parse(localStorage.getItem("myCollection"));

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
      <Image
        key={index}
        src={getTypeImg(type)}
        alt={type}
        style={{
          marginRight: "6px",
          width: "25px",
          height: "25px",
          outline: "2px solid #fff",
        }}
        roundedCircle
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

  const handleEvolveClick = async (pokemonName) => {
    localStorage.setItem("pokemonName", pokemonName);
    localStorage.setItem("pokemonSubtype", "All");
    try {
      const response = await fetch("/search-card", {
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
      });

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

  const addToCollection = (card) => {
    console.log("adding card to collection");

    // Get the user ID from Auth0
    const userId = user.sub;

    // Use the user ID to create a unique key for the collection
    const collectionKey = `myCollection_${userId}`;

    // Retrieve the current collection from localStorage using the unique key
    const currentCollectionJSON = localStorage.getItem(collectionKey);

    // Parse the JSON data to convert it into a JavaScript array
    const currentCollection = currentCollectionJSON
      ? JSON.parse(currentCollectionJSON)
      : [];

    // Check if the item already exists in the collection
    const isDuplicate = currentCollection.some((item) => {
      // Compare the properties of the item to determine if it's a duplicate
      // Assuming `card` has a unique identifier property like `id`
      return item.id === card.id; // Change `id` to the appropriate property name
    });

    // If it's not a duplicate, add the item to the collection
    if (!isDuplicate) {
      // Push the new item to the array
      currentCollection.push(card);

      // Stringify the updated array
      const updatedCollectionJSON = JSON.stringify(currentCollection);

      // Set the updated collection back into localStorage using the unique key
      localStorage.setItem(collectionKey, updatedCollectionJSON);
    } else {
      // Handle the case where the item is a duplicate
      console.log("This item already exists in the collection.");
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
    updateCollection(user.sub, collection);
  }, [isAuthenticated, user, collection]);

  return (
    <Container style={{ marginBottom: "20px" }}>
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
            <h1 className="d-flex align-items-center">
              {textWithImage(card.name)}
              <span style={{ marginLeft: "10px" }}>
                {getMultipleTypes(card.types)}
              </span>
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
              {textWithImage(card.name)}
              <span style={{ marginLeft: "10px" }}>
                {getMultipleTypes(card.types)}
              </span>
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
                        <span style={{ paddingLeft: "10px" }}>
                          {prices.low ? `$${prices.low.toFixed(2)}` : "- - -"}
                        </span>
                      </span>
                      <span className="d-flex align-items-center">
                        <MuiIcon.MarketIcon />
                        <span style={{ paddingLeft: "10px" }}>
                          {prices.market
                            ? `$${prices.market.toFixed(2)}`
                            : "- - -"}
                        </span>
                      </span>
                      <span className="d-flex align-items-center">
                        <MuiIcon.UpIcon style={{ color: `var(--bs-green)` }} />
                        <span style={{ paddingLeft: "10px" }}>
                          {prices.high ? `$${prices.high.toFixed(2)}` : "- - -"}
                        </span>
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
          <div className="image-container">
            <Image
              className="individual-page-image"
              src={card.images.large}
              alt={card.name}
            />
            <div
              className="image-overlay"
              onClick={() => addToCollection(card)}
            >
              Add to collection
              <MuiIcon.LibraryAddIcon style={{ marginLeft: "5px" }} />
            </div>
          </div>
        </Col>

        <Col md={7} className="individual-card-info">
          <h4>Card Description</h4>

          <div>
            <b>Set </b>
            <span className="card-desc-small-text">
              {card.set.name} - {card.set.series}
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
                  className="card-desc-small-text evolution"
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
                <b>Evolves to:</b>{" "}
                {card.evolvesTo.map((evolution, index) => (
                  <span
                    key={index}
                    className="card-desc-small-text"
                    onClick={() => handleEvolveClick(evolution)}
                  >
                    {index > 0 ? ", " : ""}
                    <span className="evolution">{evolution}</span>
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
                          outline: "2px solid #fff",
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
                          outline: "2px solid #fff",
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

      {window.innerWidth > 576 ? (
        <Row className="second-row" style={{ padding: "12px" }}>
          <Col xs="auto" md={5} className="individual-price-container">
            <h4>Current Prices</h4>
            <div style={{ marginBottom: "8px" }}>
              {card && card.tcgplayer && card.tcgplayer.updatedAt ? (
                <span>
                  <b>Last Updated:</b> {formattedDateString} from{" "}
                  <a
                    href="https://www.tcgplayer.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TCGplayer
                  </a>
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
              <>No price data available</>
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
