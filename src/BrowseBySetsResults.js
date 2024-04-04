import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Filter from "./Filter";
import SetsCards from "./SetsCards";

function BrowseBySetsResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // set initial checked types to either false or to location state
  const initialCheckedTypes = location.state.filteredTypes || {
    Colorless: false,
    Darkness: false,
    Dragon: false,
    Fairy: false,
    Fighting: false,
    Fire: false,
    Grass: false,
    Lightning: false,
    Metal: false,
    Psychic: false,
    Water: false,
  };

  const initialCheckedSubtypes = location.state.filteredSubTypes || {
    BREAK: false,
    Baby: false,
    Basic: false,
    EX: false,
    GX: false,
    "Goldenrod Game Corner": false,
    Item: false,
    LEGEND: false,
    "Level-Up": false,
    MEGA: false,
    "Pokémon Tool": false,
    "Pokémon Tool F": false,
    "Rapid Strike": false,
    Restored: false,
    "Rocket's Secret Machine": false,
    "Single Strike": false,
    Special: false,
    Stadium: false,
    "Stage 1": false,
    "Stage 2": false,
    Supporter: false,
    "TAG TEAM": false,
    "Technical Machine": false,
    V: false,
    VMAX: false,
  };

  const [checkedTypes, setCheckedTypes] = useState(initialCheckedTypes);
  const [checkedSubtypes, setCheckedSubtypes] = useState(
    initialCheckedSubtypes
  );

  const [hpValue, setHpValue] = useState(0);

  useEffect(() => {
    const updatedCheckedTypes =
      location.state.filteredTypes || initialCheckedTypes;
    setCheckedTypes(updatedCheckedTypes);

    const updatedCheckedSubtypes =
      location.state.filteredSubtypes || initialCheckedSubtypes;
    setCheckedSubtypes(updatedCheckedSubtypes);

    // document.getElementById("title-row").style.display = "block";
    // document.getElementById("caption-row").style.display = "block";
    // document.getElementById("search-row").style.display = "block";

    // eslint-disable-next-line
  }, [location.state.filteredTypes, location.state.filteredSubtypes]);

  const prevURLPath = location.state.path;
  const prevURLSearch = location.state.search;

  window.onpopstate = function (event) {
    navigate(`${prevURLPath}${prevURLSearch}`, {
      state: {
        prevURL: { path: location.pathname, search: location.search },
        cardData: location.state.cardData,
        filteredTypes: checkedTypes,
        filteredSubtypes: checkedSubtypes,
      },
    });
  };

  return (
    <>
      <Filter
        checkedTypes={checkedTypes}
        setCheckedTypes={setCheckedTypes}
        checkedSubtypes={checkedSubtypes}
        setCheckedSubtypes={setCheckedSubtypes}
        hpValue={hpValue}
        setHpValue={setHpValue}
      />
      <Container>
        <Row>
          <Col>
            <SetsCards
              checkedTypes={checkedTypes}
              checkedSubtypes={checkedSubtypes}
              hpValue={hpValue}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BrowseBySetsResults;
