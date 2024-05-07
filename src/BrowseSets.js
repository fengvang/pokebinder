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

function BrowseSets() {
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
  const [randomCardImgURL, setRandomCardImgURL] = useState();
  const [randomCardId, setRandomCardId] = useState();

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

  const getCardById = async () => {
    try {
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-card-by-id",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              id: randomCardId,
            },
          }),
        }
      );

      const clickedCard = await response.json();

      if (clickedCard.supertype === "Pokémon") {
        navigate(`/pokémon-card?${clickedCard.name}`, {
          state: {
            setData: hoveredSet,
            cardData: clickedCard,
          },
        });
      } else if (clickedCard.supertype === "Trainer") {
        navigate(`/trainer-card?${clickedCard.name}`, {
          state: {
            setData: hoveredSet,
            cardData: clickedCard,
          },
        });
      } else if (clickedCard.supertype === "Energy") {
        navigate(`/energy-card?${clickedCard.name}`, {
          state: {
            setData: hoveredSet,
            cardData: clickedCard,
          },
        });
      }

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  useEffect(() => {
    if (hoveredSet) {
      const setCode = hoveredSet.id;
      const randomCardNumber =
        Math.floor(Math.random() * (hoveredSet.total - 1 + 1)) + 1;
      let url;
      let id = hoveredSet.id + "-";

      switch (setCode) {
        case "swsh12pt5gg":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/GG0${randomCardNumber}.png`;
            id += "GG0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/GG${randomCardNumber}.png`;
            id += "GG" + randomCardNumber;
          }
          break;
        case "swsh12tg":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/TG0${randomCardNumber}.png`;
            id += "TG0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/TG${randomCardNumber}.png`;
            id += "TG" + randomCardNumber;
          }
          break;
        case "swsh11tg":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/TG0${randomCardNumber}.png`;
            id += "TG0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/TG${randomCardNumber}.png`;
            id += "TG" + randomCardNumber;
          }
          break;
        case "swsh10tg":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/TG0${randomCardNumber}.png`;
            id += "TG0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/TG${randomCardNumber}.png`;
            id += "TG" + randomCardNumber;
          }
          break;
        case "swsh9tg":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/TG0${randomCardNumber}.png`;
            id += "TG0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/TG${randomCardNumber}.png`;
            id += "TG" + randomCardNumber;
          }
          break;
        case "cel25c":
          const cel25cImages = [
            "https://images.pokemontcg.io/cel25c/2_A.png",
            "https://images.pokemontcg.io/cel25c/4_A.png",
            "https://images.pokemontcg.io/cel25c/15_A.png",
            "https://images.pokemontcg.io/cel25c/15_B.png",
            "https://images.pokemontcg.io/cel25c/15_C.png",
            "https://images.pokemontcg.io/cel25c/15_D.png",
            "https://images.pokemontcg.io/cel25c/73_A.png",
            "https://images.pokemontcg.io/cel25c/8_A.png",
            "https://images.pokemontcg.io/cel25c/24_A.png",
            "https://images.pokemontcg.io/cel25c/20_A.png",
            "https://images.pokemontcg.io/cel25c/66_A.png",
            "https://images.pokemontcg.io/cel25c/9_A.png",
            "https://images.pokemontcg.io/cel25c/86_A.png",
            "https://images.pokemontcg.io/cel25c/88_A.png",
            "https://images.pokemontcg.io/cel25c/93_A.png",
            "https://images.pokemontcg.io/cel25c/17_A.png",
            "https://images.pokemontcg.io/cel25c/109_A.png",
            "https://images.pokemontcg.io/cel25c/145_A.png",
            "https://images.pokemontcg.io/cel25c/107_A.png",
            "https://images.pokemontcg.io/cel25c/113_A.png",
            "https://images.pokemontcg.io/cel25c/114_A.png",
            "https://images.pokemontcg.io/cel25c/54_A.png",
            "https://images.pokemontcg.io/cel25c/97_A.png",
            "https://images.pokemontcg.io/cel25c/76_A.png",
            "https://images.pokemontcg.io/cel25c/60_A.png",
          ];

          const cel25cIds = [
            "cel25c-2_A",
            "cel25c-4_A",
            "cel25c-15_A1",
            "cel25c-15_A2",
            "cel25c-15_A3",
            "cel25c-15_A4",
            "cel25c-73_A",
            "cel25c-8_A",
            "cel25c-24_A",
            "cel25c-20_A",
            "cel25c-66_A",
            "cel25c-9_A",
            "cel25c-86_A",
            "cel25c-88_A",
            "cel25c-93_A",
            "cel25c-17_A",
            "cel25c-109_A",
            "cel25c-145_A",
            "cel25c-107_A",
            "cel25c-113_A",
            "cel25c-114_A",
            "cel25c-54_A",
            "cel25c-97_A",
            "cel25c-76_A",
            "cel25c-60_A",
          ];

          url = cel25cImages[randomCardNumber];
          id = cel25cIds[randomCardNumber];
          break;
        case "swsh45sv":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/SV00${randomCardNumber}.png`;
            id += "SV00" + randomCardNumber;
          } else if (randomCardNumber < 100) {
            url = `https://images.pokemontcg.io/${setCode}/SV0${randomCardNumber}.png`;
            id += "SV0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/SV${randomCardNumber}.png`;
            id += "SV" + randomCardNumber;
          }
          break;
        case "swshp":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/SWSH00${randomCardNumber}.png`;
            id += "SWSH00" + randomCardNumber;
          } else if (randomCardNumber < 100) {
            url = `https://images.pokemontcg.io/${setCode}/SWSH0${randomCardNumber}.png`;
            id += "SWSH0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/SWSH${randomCardNumber}.png`;
            id += "SWSH" + randomCardNumber;
          }
          break;
        case "sma":
          url = `https://images.pokemontcg.io/${setCode}/SV${randomCardNumber}.png`;
          id += "SV" + randomCardNumber;
          break;
        case "smp":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/SM0${randomCardNumber}.png`;
            id += "SM0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/SM${randomCardNumber}.png`;
            id += "SM" + randomCardNumber;
          }
          break;
        case "xyp":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/XY0${randomCardNumber}.png`;
            id += "XY0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/XY${randomCardNumber}.png`;
            id += "XY" + randomCardNumber;
          }
          break;
        case "bw11":
          if (randomCardNumber > 115) {
            const rcNumber = randomCardNumber - 115;
            url = `https://images.pokemontcg.io/${setCode}/RC${rcNumber}.png`;
            id += "RC" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/${randomCardNumber}.png`;
            id += randomCardNumber;
          }
          break;
        case "bwp":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/BW0${randomCardNumber}.png`;
            id += "BW0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/BW${randomCardNumber}.png`;
            id += "BW" + randomCardNumber;
          }
          break;
        case "hsp":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/HGSS0${randomCardNumber}.png`;
            id += "HGSS0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/HGSS${randomCardNumber}.png`;
            id += "HGSS" + randomCardNumber;
          }
          break;
        case "dpp":
          if (randomCardNumber < 10) {
            url = `https://images.pokemontcg.io/${setCode}/DP0${randomCardNumber}.png`;
            id += "DP0" + randomCardNumber;
          } else {
            url = `https://images.pokemontcg.io/${setCode}/DP${randomCardNumber}.png`;
            id += "DP" + randomCardNumber;
          }
          break;
        default:
          url = `https://images.pokemontcg.io/${setCode}/${randomCardNumber}.png`;
          id += randomCardNumber;
      }

      setRandomCardImgURL(url);
      setRandomCardId(id);
    } else {
      setRandomCardImgURL("");
      setRandomCardId("");
    }
  }, [hoveredSet]);

  localStorage.removeItem("order");

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
          <Splide
            options={{
              direction: "ttb",
              height: "70vh",
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
                  <div className="d-flex flex-col">
                    <Col xs={6}>
                      {seriesSets !== null &&
                        Object.entries(seriesSets).map(
                          ([id, set]) =>
                            set.series === item && (
                              <>
                                <span
                                  key={set.name}
                                  className="series-row-splider"
                                  onClick={() => handleSetClicked(set)}
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
                    <Col
                      xs={12}
                      md={6}
                      className="d-flex flex-column align-items-center justify-content-start"
                      style={{ width: "25vw" }}
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
                                  : hoveredSet.name === "151"
                                  ? "45%"
                                  : "70%",
                              height: "auto",
                              marginBottom: "25px",
                            }}
                            className="series-row-logo-spilder"
                            onClick={() => handleSetClicked(hoveredSet)}
                          />
                          <div className="text-center">
                            <h3>{hoveredSet.name}</h3>
                            <p className="my-0">
                              Release date: {formatDate(hoveredSet.releaseDate)}
                            </p>
                            <p className="my-0">
                              Total cards: {hoveredSet.total}
                            </p>
                            <p className="mt-5 mb-0">
                              Random card from {hoveredSet.name}
                            </p>
                            <Image
                              src={randomCardImgURL}
                              alt={`Random card from ${hoveredSet.name}`}
                              style={{
                                maxWidth:
                                  window.innerWidth < 768 ? "150px" : "200px",
                                height: "auto",
                              }}
                              className="series-row-image-splider"
                              onClick={getCardById}
                            />
                          </div>
                        </>
                      ) : null}
                    </Col>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </>
      )}
    </>
  );
}

export default BrowseSets;
