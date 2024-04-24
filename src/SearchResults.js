import { Container, Row, Col } from "react-bootstrap";
import CardList from "./CardList";

function SearchResults() {
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
