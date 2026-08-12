import React from "react";
import GamePage from "../../components/gamepage/GamePage";
import { crashGames } from "../../data/gamesData";

const cats = ["All Crash", "Aviator", "JetX", "Cricket X", "Football X", "Other"];

const CrashPage = () => (
  <GamePage title="Crash Games" games={crashGames} categories={cats} />
);

export default CrashPage;
