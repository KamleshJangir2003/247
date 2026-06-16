import React from "react";
import GamePage from "../../components/gamepage/GamePage";
import { lotteryGames } from "../../data/gamesData";

const cats = ["All Games", "Keno", "Bingo", "Lotto", "Scratch", "Jackpot"];

const LotteryPage = () => (
  <GamePage title="Lottery" games={lotteryGames} categories={cats} />
);

export default LotteryPage;
