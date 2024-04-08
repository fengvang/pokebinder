import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import CardList from "./CardList";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cardData, setCardData] = useState(null);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonSubtype, setPokemonSubtype] = useState("");

  useEffect(() => {
    document.getElementById("title-row").style.display = "block";
    document.getElementById("caption-row").style.display = "block";
    document.getElementById("search-row").style.display = "block";

    setCardData(location.state.cardData);
    setPokemonName(location.state.query.name);
    setPokemonSubtype(location.state.query.subtype);

    // eslint-disable-next-line
  }, [location.state.query.name, location.state.query.subtype]);

  const prevURLPath = location.state.path;
  const prevURLSearch = location.state.search;

  window.onpopstate = function (event) {
    navigate(`${prevURLPath}${prevURLSearch}`, {
      state: {
        prevURL: { path: prevURLPath, search: prevURLSearch },
        cardData: cardData,
        query: {
          name: pokemonName,
          subtype: pokemonSubtype,
        },
      },
    });
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <CardList
              pokemonName={pokemonName}
              pokemonSubtype={pokemonSubtype}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SearchResults;
