import React from "react";
import GamePage from "../../components/gamepage/GamePage";
import { exchangeGames } from "../../data/gamesData";

const cats = ["All Markets", "Cricket", "Football", "Tennis", "Fancy", "Session"];

const ExchangePage = () => (
  <GamePage title="Exchange" games={exchangeGames} categories={cats} />
);

export default ExchangePage;
