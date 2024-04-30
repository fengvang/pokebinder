import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";

const series = [
  "Scarlet & Violet",
  "Sword & Shield",
  "Sun & Moon",
  "Black & White",
  "HeartGold & SoulSilver",
  "Platinum",
  "Diamond & Pearl",
  "NP",
  "EX",
  "Other",
  "POP",
  "Gym",
  "Neo",
  "E-Card",
  "XY",
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

  const getSets = async () => {
    setLoading(true);

    try {
      const response = await fetch("/get-sets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setSeriesSets(data);

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

  function formatDate(originalDate) {
    const parts = originalDate.split("/");
    const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
    return formattedDate;
  }

  const handleSetClicked = async (clickedSet) => {
    const set = sessionStorage.getItem(`${clickedSet.id}`);

    if (!set) {
      setClicked(true);
      setClickedSeries(clickedSet.series);
      setClickedSet(clickedSet.name);

      try {
        const response = await fetch("/get-set-data", {
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
        });

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
          {series.map((item, index) => (
            <React.Fragment key={index}>
              <div
                key={index}
                className={`mt-5 series-row ${
                  dataLoaded ? "series-row-loaded" : ""
                }`}
              >
                <h1>{item}</h1>
              </div>
              <Row
                className={`series-row ${
                  dataLoaded ? "series-row-loaded" : ""
                }`}
                xs={2}
                sm={2}
                md={4}
              >
                {seriesSets !== null &&
                  Object.entries(seriesSets).map(
                    ([id, set]) =>
                      set.series === item && (
                        <Col key={set.id} className="series-col mx-1 my-1">
                          <Card className="my-3 series-card">
                            <Card.Img
                              variant="top"
                              src={set.images.logo}
                              style={{
                                objectFit: "contain",
                                height: "125px",
                              }}
                              onClick={() => handleSetClicked(set)}
                            />
                            <Card.Body>
                              <Card.Title>
                                <img
                                  src={set.images.symbol}
                                  alt={set.name}
                                  style={{
                                    objectFit: "contain",
                                    height: "32px",
                                  }}
                                />
                                <h4>{set.name}</h4>
                              </Card.Title>
                              <Card.Text style={{ fontSize: "1rem" }}>
                                Release date: {formatDate(set.releaseDate)}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      )
                  )}
              </Row>
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}

export default BrowseSets;
