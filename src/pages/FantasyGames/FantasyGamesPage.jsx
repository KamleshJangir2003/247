import React from "react";
import GamePage from "../../components/gamepage/GamePage";
import { fantasyGames } from "../../data/gamesData";

const cats = ["All Fantasy", "Cricket", "Football", "Kabaddi", "Basketball", "Grand League"];

const FantasyGamesPage = () => (
  <GamePage title="Fantasy Games" games={fantasyGames} categories={cats} />
);

export default FantasyGamesPage;
