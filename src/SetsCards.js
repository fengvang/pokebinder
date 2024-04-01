import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Pagination } from "react-bootstrap";

import * as MuiIcon from "./MuiIcons";

function SetsCards() {
  const location = useLocation();
  const navigate = useNavigate();
  const set = location.state.set;
  const setData = location.state.setData || location.state.cardData;

  const handleCardClick = (clickedCard) => {
    navigate(`/card?${clickedCard.name}`, {
      state: {
        prevURL: { path: location.pathname, search: location.search },
        originalCardData: location.state.setData,
        cardData: clickedCard,
        set: set,
        query: {
          name: clickedCard.name,
        },
      },
    });
  };

  const goToNextPage = async (clickedPage) => {
    try {
      const response = await fetch("/get-set-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            setID: set.id,
            page: clickedPage,
            pageSize: 32,
          },
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const cardData = await response.json();

      navigate(`/browse-by-set?${set.series}=${set.name}&page=${clickedPage}`, {
        state: {
          set: set,
          setData: cardData,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  let active = setData?.page;
  let items = [];
  let number;

  const threshold = parseInt(setData?.totalCount / setData?.pageSize + 1) + 1;
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

  return (
    <Container>
      <Row id="card-results-count">
        {setData?.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          setData?.data.map((card) => (
            <Col key={card.id} xs={6} sm={6} md={3} lg={3} xl={3}>
              <Card
                className="my-3 d-flex justify-content-center align-items-center"
                style={{ padding: "0px" }}
              >
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
    </Container>
  );
}

export default SetsCards;
