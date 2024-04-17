import { Container, Row, Col } from "react-bootstrap";
import SetsCards from "./SetsCards";

function BrowseBySetsResults() {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <SetsCards />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BrowseBySetsResults;
