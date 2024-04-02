import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Col,
  Row,
  Button,
  InputGroup,
  Spinner,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function SearchBySet() {
  const [pokemonName, setpokemonName] = useState("");
  const [set, setSet] = useState("");
  const [setSeries, setSetSeries] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastCountdown, setToastCountdown] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setpokemonName(event.target.value);
  };

  const handleSetChange = (event) => {
    setSet(event.target.value);
    setSetSeries(event.target.selectedOptions[0].parentNode.label);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchBySet();
    }
  };

  const searchBySet = async () => {
    if (
      (!pokemonName.trim() && !set.trim()) ||
      (pokemonName.trim() && !set.trim())
    ) {
      const delay = 5;
      setShowToast(true);
      setToastCountdown(delay);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/search-set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: { name: pokemonName, set: set },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }

      const cardData = await response.json();

      console.log(cardData);

      navigate(`/results?${pokemonName}${set}`, {
        state: {
          cardData: cardData,
          query: {
            name: pokemonName,
            series: setSeries,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const overflowHiddenWhenIsLoading = () => {
      document.body.style.overflow =
        isLoading && location.pathname !== "/" ? "hidden" : "auto";
    };
    overflowHiddenWhenIsLoading();

    if (toastCountdown > 0) {
      const countdownInterval = setInterval(() => {
        setToastCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Clear the interval when toastCountdown reaches 0
      return () => clearInterval(countdownInterval);
    }
  }, [isLoading, location.pathname, toastCountdown]);

  return (
    <Container>
      {location.pathname !== "/search-by-set" ? (
        <>
          <Row style={{ marginTop: "25px" }}>
            <Col className="d-flex justify-content-center align-items-center">
              <a className="title-link" href="/">
                {pokemonName !== "" && set !== "" ? (
                  <h1>
                    Searching for "{pokemonName} in {set}"
                  </h1>
                ) : (
                  <h1>Search for Pokémon Card By Set</h1>
                )}
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "20px" }}
            >
              <span id="caption-row">
                By Feng Vang with&nbsp;
                <a href="http://pokemontcg.io" target="_blank" rel="noreferrer">
                  Pokémon TCG API
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "25px" }}
            >
              <Form id="search-row">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search card by name"
                    value={pokemonName}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="main-search-bar"
                  />

                  <Form.Select
                    aria-label="Subtype dropdown"
                    bsPrefix="subtype-select"
                    value={set}
                    onChange={handleSetChange}
                    onKeyDown={handleKeyPress}
                  >
                    <optgroup label="Base">
                      <option value="Base">Base</option>
                      <option value="Base Set 2">Base Set 2</option>
                      <option value="Fossil">Fossil</option>
                      <option value="Jungle">Jungle</option>
                      <option value="Team Rocket">Team Rocket</option>
                      <option value="Wizards Black Star Promos">
                        Wizards Black Star Promos
                      </option>
                    </optgroup>
                    <optgroup label="Black & White">
                      <option value="Black & White">Black & White</option>
                      <option value="Boundaries Crossed">
                        Boundaries Crossed
                      </option>
                      <option value="BW Black Star Promos">
                        BW Black Star Promos
                      </option>
                      <option value="Dark Explorers">Dark Explorers</option>
                      <option value="Dragon Vault">Dragon Vault</option>
                      <option value="Dragons Exalted">Dragons Exalted</option>
                      <option value="Emerging Powers">Emerging Powers</option>
                      <option value="Legendary Treasures">
                        Legendary Treasures
                      </option>
                      <option value="Next Destinies">Next Destinies</option>
                      <option value="Noble Victories">Noble Victories</option>
                      <option value="Plasma Blast">Plasma Blast</option>
                      <option value="Plasma Freeze">Plasma Freeze</option>
                      <option value="Plasma Storm">Plasma Storm</option>
                    </optgroup>
                    <optgroup label="Diamond & Pearl">
                      <option value="Diamond & Pearl">Diamond & Pearl</option>
                      <option value="DP Black Star Promos">
                        DP Black Star Promos
                      </option>
                      <option value="Great Encounters">Great Encounters</option>
                      <option value="Legends Awakened">Legends Awakened</option>
                      <option value="Majestic Dawn">Majestic Dawn</option>
                      <option value="Mysterious Treasures">
                        Mysterious Treasures
                      </option>
                      <option value="Secret Wonders">Secret Wonders</option>
                      <option value="Stormfront">Stormfront</option>
                    </optgroup>
                    <optgroup label="E-Card">
                      <option value="Aquapolis">Aquapolis</option>
                      <option value="Expedition Base Set">
                        Expedition Base Set
                      </option>
                      <option value="Skyridge">Skyridge</option>
                    </optgroup>
                    <optgroup label="EX">
                      <option value="Crystal Guardians">
                        Crystal Guardians
                      </option>
                      <option value="Delta Species">Delta Species</option>
                      <option value="Deoxys">Deoxys</option>
                      <option value="Dragon">Dragon</option>
                      <option value="Dragon Frontiers">Dragon Frontiers</option>
                      <option value="Emerald">Emerald</option>
                      <option value="EX Trainer Kit 2 Minun">
                        EX Trainer Kit 2 Minun
                      </option>
                      <option value="EX Trainer Kit 2 Plusle">
                        EX Trainer Kit 2 Plusle
                      </option>
                      <option value="EX Trainer Kit Latias">
                        EX Trainer Kit Latias
                      </option>
                      <option value="EX Trainer Kit Latios">
                        EX Trainer Kit Latios
                      </option>
                      <option value="FireRed & LeafGreen">
                        FireRed & LeafGreen
                      </option>
                      <option value="Hidden Legends">Hidden Legends</option>
                      <option value="Holon Phantoms">Holon Phantoms</option>
                      <option value="Legend Maker">Legend Maker</option>
                      <option value="Power Keepers">Power Keepers</option>
                      <option value="Ruby & Sapphire">Ruby & Sapphire</option>
                      <option value="Sandstorm">Sandstorm</option>
                      <option value="Team Magma vs Team Aqua">
                        Team Magma vs Team Aqua
                      </option>
                      <option value="Team Rocket Returns">
                        Team Rocket Returns
                      </option>
                      <option value="Unseen Forces">Unseen Forces</option>
                    </optgroup>
                    <optgroup label="Gym">
                      <option value="Gym Challenge">Gym Challenge</option>
                      <option value="Gym Heroes">Gym Heroes</option>
                    </optgroup>
                    <optgroup label="HeartGold & SoulSilver">
                      <option value="Call of Legends">Call of Legends</option>
                      <option value="HGSS Black Star Promos">
                        HGSS Black Star Promos
                      </option>
                      <option value="HS—Triumphant">HS—Triumphant</option>
                      <option value="HS—Undaunted">HS—Undaunted</option>
                      <option value="HS—Unleashed">HS—Unleashed</option>
                    </optgroup>
                    <optgroup label="Neo">
                      <option value="Neo Destiny">Neo Destiny</option>
                      <option value="Neo Discovery">Neo Discovery</option>
                      <option value="Neo Genesis">Neo Genesis</option>
                      <option value="Neo Revelation">Neo Revelation</option>
                    </optgroup>
                    <optgroup label="NP">
                      <option value="Nintendo Black Star Promos">
                        Nintendo Black Star Promos
                      </option>
                    </optgroup>

                    <optgroup label="Other">
                      <option value="Best of Game">Best of Game</option>
                      <option value="Legendary Collection">
                        Legendary Collection
                      </option>
                      <option value="McDonald's Collection 2011">
                        McDonald's Collection 2011
                      </option>
                      <option value="McDonald's Collection 2012">
                        McDonald's Collection 2012
                      </option>
                      <option value="McDonald's Collection 2014">
                        McDonald's Collection 2014
                      </option>
                      <option value="McDonald's Collection 2015">
                        McDonald's Collection 2015
                      </option>
                      <option value="McDonald's Collection 2016">
                        McDonald's Collection 2016
                      </option>
                      <option value="McDonald's Collection 2017">
                        McDonald's Collection 2017
                      </option>
                      <option value="McDonald's Collection 2018">
                        McDonald's Collection 2018
                      </option>
                      <option value="McDonald's Collection 2019">
                        McDonald's Collection 2019
                      </option>
                      <option value="McDonald's Collection 2021">
                        McDonald's Collection 2021
                      </option>
                      <option value="McDonald's Collection 2022">
                        McDonald's Collection 2022
                      </option>
                      <option value="Pokémon Futsal Collection">
                        Pokémon Futsal Collection
                      </option>
                      <option value="Pokémon Rumble">Pokémon Rumble</option>
                      <option value="Southern Islands">Southern Islands</option>
                    </optgroup>
                    <optgroup label="Platinum">
                      <option value="Platinum">Platinum</option>
                      <option value="Arceus">Arceus</option>
                      <option value="Rising Rivals">Rising Rivals</option>
                      <option value="Supreme Victors">Supreme Victors</option>
                    </optgroup>

                    <optgroup label="POP">
                      <option value="POP Series 1">POP Series 1</option>
                      <option value="POP Series 2">POP Series 2</option>
                      <option value="POP Series 3">POP Series 3</option>
                      <option value="POP Series 4">POP Series 4</option>
                      <option value="POP Series 5">POP Series 5</option>
                      <option value="POP Series 6">POP Series 6</option>
                      <option value="POP Series 7">POP Series 7</option>
                      <option value="POP Series 8">POP Series 8</option>
                      <option value="POP Series 9">POP Series 9</option>
                    </optgroup>

                    <optgroup label="Scarlet & Violet">
                      <option value="151">151</option>
                      <option value="Obsidian Flames">Obsidian Flames</option>
                      <option value="Paldea Evolved">Paldea Evolved</option>
                      <option value="Paldean Fates">Paldean Fates</option>
                      <option value="Paradox Rift">Paradox Rift</option>
                      <option value="Scarlet & Violet">Scarlet & Violet</option>
                      <option value="Scarlet & Violet Black Star Promos">
                        Scarlet & Violet Black Star Promos
                      </option>
                      <option value="Scarlet & Violet Energies">
                        Scarlet & Violet Energies
                      </option>
                      <option value="Temporal Forces">Temporal Forces</option>
                    </optgroup>

                    <optgroup label="Sun & Moon">
                      <option value="Burning Shadows">Burning Shadows</option>
                      <option value="Celestial Storm">Celestial Storm</option>
                      <option value="Cosmic Eclipse">Cosmic Eclipse</option>
                      <option value="Crimson Invasion">Crimson Invasion</option>
                      <option value="Detective Pikachu">
                        Detective Pikachu
                      </option>
                      <option value="Dragon Majesty">Dragon Majesty</option>
                      <option value="Forbidden Light">Forbidden Light</option>
                      <option value="Guardians Rising">Guardians Rising</option>
                      <option value="Hidden Fates">Hidden Fates</option>
                      <option value="Hidden Fates Shiny Vault">
                        Hidden Fates Shiny Vault
                      </option>
                      <option value="Lost Thunder">Lost Thunder</option>
                      <option value="Shining Legends">Shining Legends</option>
                      <option value="SM Black Star Promos">
                        SM Black Star Promos
                      </option>
                      <option value="Team Up">Team Up</option>
                      <option value="Ultra Prism">Ultra Prism</option>
                      <option value="Unbroken Bonds">Unbroken Bonds</option>
                      <option value="Unified Minds">Unified Minds</option>
                    </optgroup>

                    <optgroup label="Sword & Shield">
                      <option value="Astral Radiance">Astral Radiance</option>
                      <option value="Astral Radiance Trainer Gallery">
                        Astral Radiance Trainer Gallery
                      </option>
                      <option value="Battle Styles">Battle Styles</option>
                      <option value="Brilliant Stars">Brilliant Stars</option>
                      <option value="Brilliant Stars Trainer Gallery">
                        Brilliant Stars Trainer Gallery
                      </option>
                      <option value="Celebrations">Celebrations</option>
                      <option value="Celebrations: Classic Collection">
                        Celebrations: Classic Collection
                      </option>
                      <option value="Champion's Path">Champion's Path</option>
                      <option value="Chilling Reign">Chilling Reign</option>
                      <option value="Crown Zenith">Crown Zenith</option>
                      <option value="Crown Zenith Galarian Gallery">
                        Crown Zenith Galarian Gallery
                      </option>
                      <option value="Darkness Ablaze">Darkness Ablaze</option>
                      <option value="Evolving Skies">Evolving Skies</option>
                      <option value="Fusion Strike">Fusion Strike</option>
                      <option value="Lost Origin">Lost Origin</option>
                      <option value="Lost Origin Trainer Gallery">
                        Lost Origin Trainer Gallery
                      </option>
                      <option value="Pokémon GO">Pokémon GO</option>
                      <option value="Rebel Clash">Rebel Clash</option>
                      <option value="Shining Fates">Shining Fates</option>
                      <option value="Shining Fates Shiny Vault">
                        Shining Fates Shiny Vault
                      </option>
                      <option value="Silver Tempest">Silver Tempest</option>
                      <option value="Silver Tempest Trainer Gallery">
                        Silver Tempest Trainer Gallery
                      </option>
                      <option value="SWSH Black Star Promos">
                        SWSH Black Star Promos
                      </option>
                      <option value="Vivid Voltage">Vivid Voltage</option>
                    </optgroup>

                    <optgroup label="XY">
                      <option value="Ancient Origins">Ancient Origins</option>
                      <option value="BREAKpoint">BREAKpoint</option>
                      <option value="BREAKthrough">BREAKthrough</option>
                      <option value="Double Crisis">Double Crisis</option>
                      <option value="Evolutions">Evolutions</option>
                      <option value="Fates Collide">Fates Collide</option>
                      <option value="Flashfire">Flashfire</option>
                      <option value="Furious Fists">Furious Fists</option>
                      <option value="Generations">Generations</option>
                      <option value="Kalos Starter Set">
                        Kalos Starter Set
                      </option>
                      <option value="Phantom Forces">Phantom Forces</option>
                      <option value="Primal Clash">Primal Clash</option>
                      <option value="Roaring Skies">Roaring Skies</option>
                      <option value="Steam Siege">Steam Siege</option>
                      <option value="XY">XY</option>
                      <option value="XY Black Star Promos">
                        XY Black Star Promos
                      </option>
                    </optgroup>
                  </Form.Select>
                  <Button className="search-button" onClick={searchBySet}>
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

          <ToastContainer position="middle-center">
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              autohide="true"
              delay="5000"
            >
              <Toast.Header closeButton={true} closeVariant="light">
                <strong className="me-auto">Invalid search</strong>
                {toastCountdown > 0 ? (
                  <small>Closing in {toastCountdown}s</small>
                ) : null}
              </Toast.Header>
              <Toast.Body>
                Please enter a valid Pokémon name or keyword.
              </Toast.Body>
            </Toast>
          </ToastContainer>

          {isLoading && location.pathname === "/search-by-set" ? (
            <Row className="d-flex flex-column justify-content-center align-items-center">
              <Spinner
                animation="border"
                role="status"
                style={{ marginTop: "0px" }}
              />
              {pokemonName
                ? `Loading results for "${pokemonName} in ${setSeries} - ${set}"`
                : null}
            </Row>
          ) : null}

          <div
            className="d-flex justify-content-center align-items-center"
            style={{ fontSize: ".78em" }}
          >
            <Link to="/" className="text-decoration-none">
              Changed your mind?
            </Link>
            <span style={{ marginLeft: "10px", marginRight: "10px" }}></span>
            <Link to="/sets" className="text-decoration-none">
              Browse new set.
            </Link>
          </div>
        </>
      ) : (
        <>
          <Row style={{ marginTop: "40vh" }}>
            <Col className="d-flex justify-content-center align-items-center">
              <a className="title-link" href="/">
                {pokemonName !== "" && set !== "" ? (
                  <h1>
                    Searching for "{pokemonName} in {set}"
                  </h1>
                ) : (
                  <h1>Search for Pokémon Card By Set</h1>
                )}
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "20px" }}
            >
              <span id="caption-row">
                By Feng Vang with&nbsp;
                <a href="http://pokemontcg.io" target="_blank" rel="noreferrer">
                  Pokémon TCG API
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "25px" }}
            >
              <Form id="search-row">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search card by name"
                    value={pokemonName}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="main-search-bar"
                  />

                  <Form.Select
                    aria-label="Subtype dropdown"
                    bsPrefix="subtype-select"
                    value={set}
                    onChange={handleSetChange}
                    onKeyDown={handleKeyPress}
                  >
                    <optgroup label="Base">
                      <option value="Base">Base</option>
                      <option value="Base Set 2">Base Set 2</option>
                      <option value="Fossil">Fossil</option>
                      <option value="Jungle">Jungle</option>
                      <option value="Team Rocket">Team Rocket</option>
                      <option value="Wizards Black Star Promos">
                        Wizards Black Star Promos
                      </option>
                    </optgroup>
                    <optgroup label="Black & White">
                      <option value="Black & White">Black & White</option>
                      <option value="Boundaries Crossed">
                        Boundaries Crossed
                      </option>
                      <option value="BW Black Star Promos">
                        BW Black Star Promos
                      </option>
                      <option value="Dark Explorers">Dark Explorers</option>
                      <option value="Dragon Vault">Dragon Vault</option>
                      <option value="Dragons Exalted">Dragons Exalted</option>
                      <option value="Emerging Powers">Emerging Powers</option>
                      <option value="Legendary Treasures">
                        Legendary Treasures
                      </option>
                      <option value="Next Destinies">Next Destinies</option>
                      <option value="Noble Victories">Noble Victories</option>
                      <option value="Plasma Blast">Plasma Blast</option>
                      <option value="Plasma Freeze">Plasma Freeze</option>
                      <option value="Plasma Storm">Plasma Storm</option>
                    </optgroup>
                    <optgroup label="Diamond & Pearl">
                      <option value="Diamond & Pearl">Diamond & Pearl</option>
                      <option value="DP Black Star Promos">
                        DP Black Star Promos
                      </option>
                      <option value="Great Encounters">Great Encounters</option>
                      <option value="Legends Awakened">Legends Awakened</option>
                      <option value="Majestic Dawn">Majestic Dawn</option>
                      <option value="Mysterious Treasures">
                        Mysterious Treasures
                      </option>
                      <option value="Secret Wonders">Secret Wonders</option>
                      <option value="Stormfront">Stormfront</option>
                    </optgroup>
                    <optgroup label="E-Card">
                      <option value="Aquapolis">Aquapolis</option>
                      <option value="Expedition Base Set">
                        Expedition Base Set
                      </option>
                      <option value="Skyridge">Skyridge</option>
                    </optgroup>
                    <optgroup label="EX">
                      <option value="Crystal Guardians">
                        Crystal Guardians
                      </option>
                      <option value="Delta Species">Delta Species</option>
                      <option value="Deoxys">Deoxys</option>
                      <option value="Dragon">Dragon</option>
                      <option value="Dragon Frontiers">Dragon Frontiers</option>
                      <option value="Emerald">Emerald</option>
                      <option value="EX Trainer Kit 2 Minun">
                        EX Trainer Kit 2 Minun
                      </option>
                      <option value="EX Trainer Kit 2 Plusle">
                        EX Trainer Kit 2 Plusle
                      </option>
                      <option value="EX Trainer Kit Latias">
                        EX Trainer Kit Latias
                      </option>
                      <option value="EX Trainer Kit Latios">
                        EX Trainer Kit Latios
                      </option>
                      <option value="FireRed & LeafGreen">
                        FireRed & LeafGreen
                      </option>
                      <option value="Hidden Legends">Hidden Legends</option>
                      <option value="Holon Phantoms">Holon Phantoms</option>
                      <option value="Legend Maker">Legend Maker</option>
                      <option value="Power Keepers">Power Keepers</option>
                      <option value="Ruby & Sapphire">Ruby & Sapphire</option>
                      <option value="Sandstorm">Sandstorm</option>
                      <option value="Team Magma vs Team Aqua">
                        Team Magma vs Team Aqua
                      </option>
                      <option value="Team Rocket Returns">
                        Team Rocket Returns
                      </option>
                      <option value="Unseen Forces">Unseen Forces</option>
                    </optgroup>
                    <optgroup label="Gym">
                      <option value="Gym Challenge">Gym Challenge</option>
                      <option value="Gym Heroes">Gym Heroes</option>
                    </optgroup>
                    <optgroup label="HeartGold & SoulSilver">
                      <option value="Call of Legends">Call of Legends</option>
                      <option value="HGSS Black Star Promos">
                        HGSS Black Star Promos
                      </option>
                      <option value="HS—Triumphant">HS—Triumphant</option>
                      <option value="HS—Undaunted">HS—Undaunted</option>
                      <option value="HS—Unleashed">HS—Unleashed</option>
                    </optgroup>
                    <optgroup label="Neo">
                      <option value="Neo Destiny">Neo Destiny</option>
                      <option value="Neo Discovery">Neo Discovery</option>
                      <option value="Neo Genesis">Neo Genesis</option>
                      <option value="Neo Revelation">Neo Revelation</option>
                    </optgroup>
                    <optgroup label="NP">
                      <option value="Nintendo Black Star Promos">
                        Nintendo Black Star Promos
                      </option>
                    </optgroup>

                    <optgroup label="Other">
                      <option value="Best of Game">Best of Game</option>
                      <option value="Legendary Collection">
                        Legendary Collection
                      </option>
                      <option value="McDonald's Collection 2011">
                        McDonald's Collection 2011
                      </option>
                      <option value="McDonald's Collection 2012">
                        McDonald's Collection 2012
                      </option>
                      <option value="McDonald's Collection 2014">
                        McDonald's Collection 2014
                      </option>
                      <option value="McDonald's Collection 2015">
                        McDonald's Collection 2015
                      </option>
                      <option value="McDonald's Collection 2016">
                        McDonald's Collection 2016
                      </option>
                      <option value="McDonald's Collection 2017">
                        McDonald's Collection 2017
                      </option>
                      <option value="McDonald's Collection 2018">
                        McDonald's Collection 2018
                      </option>
                      <option value="McDonald's Collection 2019">
                        McDonald's Collection 2019
                      </option>
                      <option value="McDonald's Collection 2021">
                        McDonald's Collection 2021
                      </option>
                      <option value="McDonald's Collection 2022">
                        McDonald's Collection 2022
                      </option>
                      <option value="Pokémon Futsal Collection">
                        Pokémon Futsal Collection
                      </option>
                      <option value="Pokémon Rumble">Pokémon Rumble</option>
                      <option value="Southern Islands">Southern Islands</option>
                    </optgroup>
                    <optgroup label="Platinum">
                      <option value="Platinum">Platinum</option>
                      <option value="Arceus">Arceus</option>
                      <option value="Rising Rivals">Rising Rivals</option>
                      <option value="Supreme Victors">Supreme Victors</option>
                    </optgroup>

                    <optgroup label="POP">
                      <option value="POP Series 1">POP Series 1</option>
                      <option value="POP Series 2">POP Series 2</option>
                      <option value="POP Series 3">POP Series 3</option>
                      <option value="POP Series 4">POP Series 4</option>
                      <option value="POP Series 5">POP Series 5</option>
                      <option value="POP Series 6">POP Series 6</option>
                      <option value="POP Series 7">POP Series 7</option>
                      <option value="POP Series 8">POP Series 8</option>
                      <option value="POP Series 9">POP Series 9</option>
                    </optgroup>

                    <optgroup label="Scarlet & Violet">
                      <option value="151">151</option>
                      <option value="Obsidian Flames">Obsidian Flames</option>
                      <option value="Paldea Evolved">Paldea Evolved</option>
                      <option value="Paldean Fates">Paldean Fates</option>
                      <option value="Paradox Rift">Paradox Rift</option>
                      <option value="Scarlet & Violet">Scarlet & Violet</option>
                      <option value="Scarlet & Violet Black Star Promos">
                        Scarlet & Violet Black Star Promos
                      </option>
                      <option value="Scarlet & Violet Energies">
                        Scarlet & Violet Energies
                      </option>
                      <option value="Temporal Forces">Temporal Forces</option>
                    </optgroup>

                    <optgroup label="Sun & Moon">
                      <option value="Burning Shadows">Burning Shadows</option>
                      <option value="Celestial Storm">Celestial Storm</option>
                      <option value="Cosmic Eclipse">Cosmic Eclipse</option>
                      <option value="Crimson Invasion">Crimson Invasion</option>
                      <option value="Detective Pikachu">
                        Detective Pikachu
                      </option>
                      <option value="Dragon Majesty">Dragon Majesty</option>
                      <option value="Forbidden Light">Forbidden Light</option>
                      <option value="Guardians Rising">Guardians Rising</option>
                      <option value="Hidden Fates">Hidden Fates</option>
                      <option value="Hidden Fates Shiny Vault">
                        Hidden Fates Shiny Vault
                      </option>
                      <option value="Lost Thunder">Lost Thunder</option>
                      <option value="Shining Legends">Shining Legends</option>
                      <option value="SM Black Star Promos">
                        SM Black Star Promos
                      </option>
                      <option value="Team Up">Team Up</option>
                      <option value="Ultra Prism">Ultra Prism</option>
                      <option value="Unbroken Bonds">Unbroken Bonds</option>
                      <option value="Unified Minds">Unified Minds</option>
                    </optgroup>

                    <optgroup label="Sword & Shield">
                      <option value="Astral Radiance">Astral Radiance</option>
                      <option value="Astral Radiance Trainer Gallery">
                        Astral Radiance Trainer Gallery
                      </option>
                      <option value="Battle Styles">Battle Styles</option>
                      <option value="Brilliant Stars">Brilliant Stars</option>
                      <option value="Brilliant Stars Trainer Gallery">
                        Brilliant Stars Trainer Gallery
                      </option>
                      <option value="Celebrations">Celebrations</option>
                      <option value="Celebrations: Classic Collection">
                        Celebrations: Classic Collection
                      </option>
                      <option value="Champion's Path">Champion's Path</option>
                      <option value="Chilling Reign">Chilling Reign</option>
                      <option value="Crown Zenith">Crown Zenith</option>
                      <option value="Crown Zenith Galarian Gallery">
                        Crown Zenith Galarian Gallery
                      </option>
                      <option value="Darkness Ablaze">Darkness Ablaze</option>
                      <option value="Evolving Skies">Evolving Skies</option>
                      <option value="Fusion Strike">Fusion Strike</option>
                      <option value="Lost Origin">Lost Origin</option>
                      <option value="Lost Origin Trainer Gallery">
                        Lost Origin Trainer Gallery
                      </option>
                      <option value="Pokémon GO">Pokémon GO</option>
                      <option value="Rebel Clash">Rebel Clash</option>
                      <option value="Shining Fates">Shining Fates</option>
                      <option value="Shining Fates Shiny Vault">
                        Shining Fates Shiny Vault
                      </option>
                      <option value="Silver Tempest">Silver Tempest</option>
                      <option value="Silver Tempest Trainer Gallery">
                        Silver Tempest Trainer Gallery
                      </option>
                      <option value="SWSH Black Star Promos">
                        SWSH Black Star Promos
                      </option>
                      <option value="Vivid Voltage">Vivid Voltage</option>
                    </optgroup>

                    <optgroup label="XY">
                      <option value="Ancient Origins">Ancient Origins</option>
                      <option value="BREAKpoint">BREAKpoint</option>
                      <option value="BREAKthrough">BREAKthrough</option>
                      <option value="Double Crisis">Double Crisis</option>
                      <option value="Evolutions">Evolutions</option>
                      <option value="Fates Collide">Fates Collide</option>
                      <option value="Flashfire">Flashfire</option>
                      <option value="Furious Fists">Furious Fists</option>
                      <option value="Generations">Generations</option>
                      <option value="Kalos Starter Set">
                        Kalos Starter Set
                      </option>
                      <option value="Phantom Forces">Phantom Forces</option>
                      <option value="Primal Clash">Primal Clash</option>
                      <option value="Roaring Skies">Roaring Skies</option>
                      <option value="Steam Siege">Steam Siege</option>
                      <option value="XY">XY</option>
                      <option value="XY Black Star Promos">
                        XY Black Star Promos
                      </option>
                    </optgroup>
                  </Form.Select>
                  <Button className="search-button" onClick={searchBySet}>
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

          <ToastContainer position="middle-center">
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              autohide="true"
              delay="5000"
            >
              <Toast.Header closeButton={true} closeVariant="light">
                <strong className="me-auto">Invalid search</strong>
                {toastCountdown > 0 ? (
                  <small>Closing in {toastCountdown}s</small>
                ) : null}
              </Toast.Header>
              <Toast.Body>
                Please enter a valid Pokémon name or keyword.
              </Toast.Body>
            </Toast>
          </ToastContainer>

          {isLoading && location.pathname === "/search-by-set" ? (
            <Row className="d-flex flex-column justify-content-center align-items-center">
              <Spinner
                animation="border"
                role="status"
                style={{ marginTop: "0px" }}
              />
              {pokemonName
                ? `Loading results for "${pokemonName} in ${setSeries} - ${set}"`
                : null}
            </Row>
          ) : null}

          <div
            className="d-flex justify-content-center align-items-center"
            style={{ fontSize: ".78em" }}
          >
            <Link to="/" className="text-decoration-none">
              Changed your mind?
            </Link>
            <span style={{ marginLeft: "10px", marginRight: "10px" }}></span>
            <Link to="/sets" className="text-decoration-none">
              Or browse by sets instead.
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}

export default SearchBySet;
