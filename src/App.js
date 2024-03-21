import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <SearchForm />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/results" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
