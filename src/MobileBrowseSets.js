import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Col, Image } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";

import { formatDate } from "./Functions";

const series = [
  "Scarlet & Violet",
  "Sword & Shield",
  "Other",
  "Sun & Moon",
  "XY",
  "Black & White",
  "HeartGold & SoulSilver",
  "Platinum",
  "POP",
  "Diamond & Pearl",
  "EX",
  "NP",
  "E-Card",
  "Neo",
  "Gym",
  "Base",
];

function MobileBrowseSets() {
  const navigate = useNavigate();
  const sessionSeriesSets = JSON.parse(sessionStorage.getItem("seriesSets"));
  const [seriesSets, setSeriesSets] = useState(sessionSeriesSets || null);
  const [isLoading, setLoading] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [clickedSeries, setClickedSeries] = useState("");
  const [clickedSet, setClickedSet] = useState("");
  const [dataLoaded, setdataLoaded] = useState(false);
  const [hoveredSet, setHoveredSet] = useState(
    JSON.parse(sessionStorage.getItem("newestSet")) || null
  );

  const getSets = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-sets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      setSeriesSets(data);
      setHoveredSet(data[0]);

      sessionStorage.setItem("seriesSets", JSON.stringify(data));

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetClicked = async (clickedSet) => {
    const set = sessionStorage.getItem(`${clickedSet.id}`);

    if (!set) {
      setClicked(true);
      setClickedSeries(clickedSet.series);
      setClickedSet(clickedSet.name);

      try {
        const response = await fetch(
          "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-set-data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: {
                setID: clickedSet.id,
                page: 1,
                pageSize: 36,
              },
            }),
          }
        );

        const data = await response.json();

        sessionStorage.setItem(`${clickedSet.id}`, JSON.stringify(data));

        navigate(
          `/browse-by-set?${clickedSet.series}-${clickedSet.name}&page=1`,
          {
            state: {
              set: clickedSet,
              setData: data,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch end point");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setClicked(false);
      }
    } else {
      navigate(
        `/browse-by-set?${clickedSet.series}-${clickedSet.name}&page=1`,
        {
          state: {
            set: clickedSet,
            setData: JSON.parse(set),
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!seriesSets) getSets();

    document.body.style.overflow = isClicked || isLoading ? "hidden" : "auto";
    // eslint-disable-next-line
  }, [isClicked, isLoading]);

  useEffect(() => {
    if (seriesSets !== null) {
      setdataLoaded(true);
      setClicked(false);
    }
  }, [seriesSets]);

  localStorage.removeItem("order");

  useEffect(() => {
    document.title = "Pokébinder - Browse by Set";

    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isClicked && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
          }}
        >
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div
              className="text-center loading-div-mobile"
              style={{ width: "20vw" }}
            >
              <h5>
                Loading {clickedSeries} - {clickedSet}
              </h5>
              <LinearProgress
                sx={{
                  backgroundColor: "var(--ghost)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "var(--flying)",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
      {isLoading && !isClicked ? (
        <div className="getting-sets-loading-screen">
          <div
            className="text-center loading-div-mobile"
            style={{ width: "20vw" }}
          >
            <h5>Loading sets</h5>
            <LinearProgress
              sx={{
                backgroundColor: "var(--ghost)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "var(--flying)",
                },
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <Col
            className="d-flex flex-column align-items-center justify-content-center my-4"
            style={{ height: "25vh" }}
          >
            {hoveredSet ? (
              <>
                <Image
                  src={hoveredSet.images.logo}
                  style={{
                    maxWidth:
                      hoveredSet.series === "Other" ||
                      hoveredSet.series === "POP" ||
                      hoveredSet.name.includes("Promo")
                        ? "30%"
                        : hoveredSet.name === "151" ||
                          hoveredSet.name === "Paldean Fates"
                        ? "45%"
                        : "70%",
                    height: "auto",
                    margin: "25px 0px 25px 0px",
                  }}
                  className="series-row-logo-spilder"
                  onClick={() => handleSetClicked(hoveredSet)}
                />
                <div className="text-center">
                  <h3>{hoveredSet.name}</h3>
                  <p className="my-0">
                    Release date: {formatDate(hoveredSet.releaseDate)}
                  </p>
                  <p className="my-0">Total cards: {hoveredSet.total}</p>
                </div>
              </>
            ) : null}
          </Col>
          <Splide
            options={{
              direction: "ttb",
              height: "50vh",
              wheel: true,
              arrows: false,
            }}
          >
            {series.map((item, index) => (
              <SplideSlide key={item.id} className={"d-flex align-items-start"}>
                <div
                  className={`mt-5 series-row ${
                    dataLoaded ? "series-row-loaded" : ""
                  }`}
                >
                  <h1>{item}</h1>
                  {item === "Sword & Shield" ? (
                    <Col xs={10}>
                      <Splide
                        options={{
                          direction: "ttb",
                          height: "250px",
                          wheel: true,
                          arrows: false,
                        }}
                      >
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(0, seriesSets.length / 7.8)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(
                                seriesSets.length / 7.8,
                                seriesSets.length / 5.1
                              )
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(seriesSets.length / 5.1, seriesSets.length)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                      </Splide>
                    </Col>
                  ) : item === "Other" ? (
                    <Col xs={10}>
                      <Splide
                        options={{
                          direction: "ttb",
                          height: "250px",
                          wheel: true,
                          arrows: false,
                        }}
                      >
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(0, seriesSets.length / 1.8)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(seriesSets.length / 1.8, seriesSets.length)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                      </Splide>
                    </Col>
                  ) : item === "Sun & Moon" ? (
                    <Col xs={10}>
                      <Splide
                        options={{
                          direction: "ttb",
                          height: "250px",
                          wheel: true,
                          arrows: false,
                        }}
                      >
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(0, seriesSets.length / 3.2)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(seriesSets.length / 3.2, seriesSets.length)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                      </Splide>
                    </Col>
                  ) : item === "XY" ? (
                    <Col xs={10}>
                      <Splide
                        options={{
                          direction: "ttb",
                          height: "250px",
                          wheel: true,
                          arrows: false,
                        }}
                      >
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(0, seriesSets.length / 2.27)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(
                                seriesSets.length / 2.27,
                                seriesSets.length
                              )
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                      </Splide>
                    </Col>
                  ) : item === "EX" ? (
                    <Col xs={10}>
                      <Splide
                        options={{
                          direction: "ttb",
                          height: "250px",
                          wheel: true,
                          arrows: false,
                        }}
                      >
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(0, seriesSets.length / 1.26)
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(
                                seriesSets.length / 1.26,
                                seriesSets.length / 1.15
                              )
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                        <SplideSlide>
                          {seriesSets !== null &&
                            Object.entries(seriesSets)
                              .slice(
                                seriesSets.length / 1.15,
                                seriesSets.length
                              )
                              .map(
                                ([id, set]) =>
                                  set.series === item && (
                                    <>
                                      <span
                                        key={set.name}
                                        className="series-row-splider"
                                        onMouseEnter={() => setHoveredSet(set)}
                                      >
                                        <Image
                                          src={set.images.symbol}
                                          style={{
                                            maxWidth: "25px",
                                            marginRight: "15px",
                                          }}
                                          alt={set.name + " symbol"}
                                        />
                                        {set.name}
                                      </span>
                                    </>
                                  )
                              )}
                        </SplideSlide>
                      </Splide>
                    </Col>
                  ) : (
                    <Col xs={10}>
                      {seriesSets !== null &&
                        Object.entries(seriesSets).map(
                          ([id, set]) =>
                            set.series === item && (
                              <>
                                <span
                                  key={set.name}
                                  className="series-row-splider"
                                  onMouseEnter={() => setHoveredSet(set)}
                                >
                                  <Image
                                    src={set.images.symbol}
                                    style={{
                                      maxWidth: "25px",
                                      marginRight: "15px",
                                    }}
                                    alt={set.name + " symbol"}
                                  />
                                  {set.name}
                                </span>
                              </>
                            )
                        )}
                    </Col>
                  )}
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </>
      )}
    </>
  );
}

export default MobileBrowseSets;
