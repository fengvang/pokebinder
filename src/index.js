import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";

import Home from "./Home";
import Footer from "./Footer";
import SearchResults from "./SearchResults";
import IndividualPagePokémon from "./IndividualPagePokémon";
import IndividualPageTrainer from "./IndividualPageTrainer";
import IndividualPageEnergy from "./IndividualPageEnergy";
import Rarity from "./Rarity";
import BrowseSets from "./BrowseSets";
import BrowseBySetsResults from "./BrowseBySetsResults";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import Profile from "./Profile";
import Collection from "./Collection";
import VerifyEmail from "./VerifyEmail";
import Wishlist from "./Wishlist";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container } from "react-bootstrap";
import MobileBrowseSets from "./MobileBrowseSets";

function Layout() {
  const location = useLocation();
  const loginPath = location.pathname === "/login";
  const createAccountPath = location.pathname === "/create-account";

  useEffect(() => {
    if (loginPath || createAccountPath) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loginPath, createAccountPath]);

  return (
    <>
      <Home />
      <Container className="mb-5">
        <Outlet />
      </Container>
      <Footer />
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
      { path: "/rarity", element: <Rarity /> },
      {
        path: "/search-by-set",
        element: null,
      },
      {
        path: "/sets",
        element:
          window.innerWidth < 576 ? <MobileBrowseSets /> : <BrowseSets />,
      },
      {
        path: "/browse-by-set",
        element: <BrowseBySetsResults />,
      },
      { path: "/login", element: <Login /> },
      { path: "/create-account", element: <CreateAccount /> },
      { path: "/profile", element: <Profile /> },
      { path: "/collection", element: <Collection /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/wishlist", element: <Wishlist /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
