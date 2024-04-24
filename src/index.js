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
import IndividualPagePokémon from "./IndividualPagePokémon";
import IndividualPageTrainer from "./IndividualPageTrainer";
import IndividualPageEnergy from "./IndividualPageEnergy";
import BrowseSets from "./BrowseSets";
import BrowseBySetsResults from "./BrowseBySetsResults";
import CreateAccount from "./CreateAccount";
import Profile from "./Profile";
import Collection from "./Collection";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Login";

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
        element: <SearchResults />,
      },
      {
        path: "/pokémon-card",
        element: <IndividualPagePokémon />,
      },
      { path: "/trainer-card", element: <IndividualPageTrainer /> },
      { path: "/energy-card", element: <IndividualPageEnergy /> },
      {
        path: "/search-by-set",
        element: null,
      },
      {
        path: "/sets",
        element: <BrowseSets />,
      },
      {
        path: "/browse-by-set",
        element: <BrowseBySetsResults />,
      },
      { path: "/login", element: <Login /> },
      { path: "/create-account", element: <CreateAccount /> },
      { path: "/profile", element: <Profile /> },
      { path: "/collection", element: <Collection /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
