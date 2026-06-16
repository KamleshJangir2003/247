import React from "react";
import GamePage from "../../components/gamepage/GamePage";
import { sportsbookGames } from "../../data/gamesData";

const cats = ["All Sports", "Cricket", "Football", "Tennis", "Basketball", "E-Sports", "Others"];

const Sportsbook1Page = () => (
  <GamePage title="Sportsbook1" games={sportsbookGames} categories={cats} />
);

export default Sportsbook1Page;
