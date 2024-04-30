import { Link } from "react-router-dom";

import { Col } from "react-bootstrap";

function Footer() {
  return (
    <>
      <footer id="footer">
        <Col className="d-flex justify-content-center align-items-center">
          Pokémon card data available via&nbsp;
          <Link to="https://pokemontcg.io/" target="_blank">
            Pokémon TCG API
          </Link>
        </Col>

        <Col className="d-flex justify-content-center align-items-center mt-3">
          This site is not affiliated with or endorsed by the Pokémon Company.
        </Col>
      </footer>
    </>
  );
}

export default Footer;
