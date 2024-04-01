import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Pagination } from "react-bootstrap";

import * as MuiIcon from "./MuiIcons";

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
            pageSize: 32,
          },
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const cardData = await response.json();

      navigate(`/results?${pokemonName}&page=${clickedPage}`, {
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
  let number;

  const threshold =
    parseInt(pokemonCardList?.totalCount / pokemonCardList?.pageSize + 1) + 1;
  const currentPage = parseInt(
    location.search.charAt(location.search.length - 1)
  );

  const nextPageValue =
    currentPage + 1 < threshold ? currentPage + 1 : threshold;
  const nextPage =
    nextPageValue === threshold ? nextPageValue - 1 : nextPageValue;

  const prevPageValue = currentPage - 1 > 1 ? currentPage - 1 : 1;
  const prevPage = prevPageValue < 1 ? prevPageValue + 1 : prevPageValue;

  items.push(
    <Pagination.Item
      key={-1}
      onClick={() => goToNextPage(1)}
      linkClassName="pagination-buttons first-last-next-prev-buttons"
    >
      <MuiIcon.FirstPageIcon />
    </Pagination.Item>
  );
  items.push(
    <Pagination.Item
      key={0}
      onClick={() => goToNextPage(prevPage)}
      linkClassName="pagination-buttons first-last-next-prev-buttons"
    >
      <MuiIcon.NavigateBeforeIcon />
    </Pagination.Item>
  );

  for (let number = 1; number < threshold; number++) {
    ((num) => {
      items.push(
        <Pagination.Item
          key={num}
          active={num === active}
          onClick={() => goToNextPage(num)}
          linkClassName="pagination-buttons"
        >
          {num}
        </Pagination.Item>
      );
    })(number);
  }

  items.push(
    <Pagination.Item
      key={`next-${number + 1}`}
      onClick={() => goToNextPage(nextPage)}
      linkClassName="pagination-buttons first-last-next-prev-buttons"
    >
      <MuiIcon.NavigateNextIcon />
    </Pagination.Item>
  );

  items.push(
    <Pagination.Item
      key={`last-${number + 2}`}
      onClick={() => goToNextPage(threshold - 1)}
      linkClassName="pagination-buttons first-last-next-prev-buttons"
    >
      <MuiIcon.LastPageIcon />
    </Pagination.Item>
  );

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
            <Col key={card.id} xs={6} sm={6} md={3} lg={3} xl={3}>
              <Card className="my-3 d-flex justify-content-center align-items-center">
                <Card.Img
                  className="card-image"
                  src={card.images.large}
                  alt={card.name}
                  style={{ width: "100%" }}
                  onClick={() => handleCardClick(card)}
                  onLoad={(e) => e.target.classList.add("card-image-loaded")}
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
