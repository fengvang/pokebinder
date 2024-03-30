import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import Home from "./Home";
import SearchResults from "./SearchResults";
import IndividualPage from "./IndividualPage";
import SearchBySet from "./SearchBySet";
import BrowseSets from "./BrowseSets";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Layout() {
  return (
    <>
      <Home />
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/results",
        element: <SearchResults preventScrollReset={true} />,
      },
      {
        path: "/card",
        element: <IndividualPage preventScrollReset={true} />,
      },
      {
        path: "/search-by-set",
        element: <SearchBySet preventScrollReset={true} />,
      },
      {
        path: "/sets",
        element: <BrowseSets preventScrollReset={true} />,
      },
    ],
  },
]);

console.log(router.state);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
