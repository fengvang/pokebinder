import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import SearchForm from "./SearchForm";
import SearchBySet from "./SearchBySet";

function Home() {
  const location = useLocation();

  const searchBySetPath = location.pathname === "/search-by-set";
  const setsPath = location.pathname === "/sets";
  const browseBySetsPath = location.pathname === "/browse-by-set";

  return (
    <>
      {searchBySetPath || setsPath || browseBySetsPath ? null : <SearchForm />}
      {searchBySetPath || setsPath || browseBySetsPath ? null : (
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ fontSize: ".78em" }}
        >
          <Link to="/search-by-set" id="search-by-set-row">
            Want to search by sets instead?
          </Link>
        </Container>
      )}
      {browseBySetsPath ? <SearchBySet /> : null}
    </>
  );
}

export default Home;
