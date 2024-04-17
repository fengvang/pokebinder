import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import CardList from "./CardList";

function SearchResults() {
  const location = useLocation();

  useEffect(() => {
    document.getElementById("title-row").style.display = "block";
    document.getElementById("caption-row").style.display = "block";
    document.getElementById("search-row").style.display = "block";

    // eslint-disable-next-line
  }, [location.state.name, location.state.subtype]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <CardList />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SearchResults;
