import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import App from "./App";
import SearchResults from "./SearchResults";
import IndividualPage from "./IndividualPage";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <React.Fragment>
      <Route exact path="/" element={<App />} />
      <Route path="/results" element={<SearchResults />} />
      <Route path="/card" element={<IndividualPage />} />
    </React.Fragment>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <ScrollRestoration />
    </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
