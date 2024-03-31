import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Pagination } from "react-bootstrap";

function CardList({
  checkedTypes,
  checkedSubtypes,
  hpValue,
  pokemonName,
  pokemonSubtype,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);

  const handleCardClick = (clickedCard) => {
    navigate(`/card?${clickedCard.name}`, {
      state: {
        prevURL: { path: location.pathname, search: location.search },
        originalCardData: location.state.cardData,
        cardData: clickedCard,
        filteredTypes: checkedTypes,
        filteredSubtypes: checkedSubtypes,
        query: {
          name: pokemonName,
          subtype: pokemonSubtype,
        },
      },
    });
  };

  const goToNextPage = async (clickedPage) => {
    try {
      console.log("pokemon ", pokemonName);
      console.log("subtype ", pokemonSubtype);
      console.log("going to page ", clickedPage);
      const response = await fetch("/search-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            name: pokemonName,
            subtype: pokemonSubtype,
            page: clickedPage,
            pageSize: 16,
          },
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const cardData = await response.json();

      navigate(`/results?${pokemonName}`, {
        state: {
          cardData: cardData,
          query: {
            name: pokemonName,
            subtype: pokemonSubtype,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  let active = pokemonCardList?.page;
  let items = [];

  for (
    let number = 1;
    number <= pokemonCardList?.totalCount / pokemonCardList?.pageSize + 1;
    number++
  ) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => goToNextPage(number)}
        linkClassName="pagination-buttons"
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);

    // const cardHPMatch =
    //   hpValue <= 0 || hpValue >= 300 || parseInt(card.hp) <= hpValue;
    // return cardHPMatch;
  }, [location.state.cardData]);

  return (
    <>
      <Row id="card-results-count">
        {pokemonCardList?.data.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          pokemonCardList?.data.map((card) => (
            <Col key={card.id} xs={6} sm={3} md={2} lg={2} xl={3}>
              <Card className="my-3">
                <Card.Img
                  className="card-image"
                  src={card.images.large}
                  alt={card.name}
                  onClick={() => handleCardClick(card)}
                />
              </Card>
            </Col>
          ))
        )}
      </Row>
      <Row className="pagination-row">
        {items.length === 1 ? null : <Pagination>{items}</Pagination>}
      </Row>
    </>
  );
}

export default CardList;
