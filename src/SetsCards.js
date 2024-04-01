import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Pagination } from "react-bootstrap";

function SetsCards() {
  const location = useLocation();
  const navigate = useNavigate();
  const set = location.state.set;
  const setData = location.state.setData;

  const goToNextPage = async (clickedPage) => {
    try {
      console.log(set.id);
      const response = await fetch("/get-set-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            setID: set.id,
            page: clickedPage,
            pageSize: 30,
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

  for (
    let number = 1;
    number < setData?.totalCount / setData?.pageSize + 1;
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

  return (
    <Container>
      <Row id="card-results-count">
        {setData?.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          setData?.data.map((card) => (
            <Col key={card.id} xs={6} sm={6} md={2} lg={2} xl={2}>
              <Card className="my-3">
                <Card.Img
                  className="card-image"
                  src={card.images.large}
                  alt={card.name}
                  style={{ width: "100%" }}
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
