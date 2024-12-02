import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";

function Rarity() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);
  const numPages =
    pokemonCardList?.totalCount && pokemonCardList?.pageSize
      ? Math.ceil(pokemonCardList.totalCount / pokemonCardList.pageSize)
      : 0;
  const rarity = location.state.rarity;

  const [currentPage, setCurrentPage] = useState(1);

  const handleCardClick = (clickedCard) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/pokémon-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    } else if (clickedCard.supertype === "Trainer") {
      navigate(`/trainer-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    } else if (clickedCard.supertype === "Energy") {
      navigate(`/energy-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    }
  };

  const handleChange = async (page) => {
    setCurrentPage(page);

    try {
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-rarity-cards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              rarity: rarity,
              page: page,
              pageSize: 36,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      navigate(`/rarity?${rarity}&page=${page}`, {
        state: {
          cardData: data,
          rarity: rarity,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);
    setCurrentPage(cardData?.page);
  }, [location.state.cardData]);

  useEffect(() => {
    document.title = `Pokébinder - ${rarity}`;

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="mt-5">
        {pokemonCardList?.data.length === 0 ? (
          <h5 className="d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          <>
            <h1>
              {rarity} ({pokemonCardList?.totalCount} cards)
            </h1>
            {pokemonCardList?.data.map((card) => (
              <span key={card.id} className="card-image-col">
                <Image
                  className="card-image"
                  src={card.images.small}
                  alt={card.name}
                  onClick={() => handleCardClick(card)}
                  onLoad={(e) => e.target.classList.add("card-image-loaded")}
                />
              </span>
            ))}
          </>
        )}

        <div>
          {window.innerWidth < 768 ? (
            <Pagination
              count={numPages}
              color="primary"
              shape="rounded"
              variant="outlined"
              showFirstButton={true}
              showLastButton={true}
              hideNextButton={true}
              hidePrevButton={true}
              boundaryCount={1}
              siblingCount={1}
              page={currentPage}
              onChange={(event, page) => handleChange(page)}
            />
          ) : (
            <Pagination
              count={numPages}
              color="primary"
              shape="rounded"
              variant="outlined"
              showFirstButton={true}
              showLastButton={true}
              boundaryCount={1}
              siblingCount={4}
              page={currentPage}
              onChange={(event, page) => handleChange(page)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Rarity;
