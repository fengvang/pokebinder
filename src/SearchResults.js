import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

function SearchResults() {
  const location = useLocation();
  const [pokemonCardList, setPokemonCardList] = useState(null);

  useEffect(() => {
    console.log(location.pathname);
    // const cardData = location.state.cardData;
    // if (cardData !== null) setPokemonCardList(cardData);
  });

  return (
    <Container fluid="sm">
      <Row>
        {/* {pokemonCardList?.data.map((card) => (
          <p key={card.id}>{card.name}</p>
        ))} */}
        <h1>data here</h1>
      </Row>
    </Container>
  );
}

export default SearchResults;
