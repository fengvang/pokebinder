import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import SearchForm from "./SearchForm";

function Home() {
  const location = useLocation();

  const searchBySetPath = location.pathname === "/search-by-set";

  return (
    <>
      {!searchBySetPath && <SearchForm />}
      {!searchBySetPath ? (
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ fontSize: ".78em" }}
        >
          <Link to="/search-by-set">Want to search by sets instead?</Link>
        </Container>
      ) : null}
    </>
  );
}

export default Home;
