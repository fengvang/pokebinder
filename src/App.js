import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SearchForm />} />
          <Route path="/results" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
