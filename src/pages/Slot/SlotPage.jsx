import React from "react";
import GamePage from "../../components/gamepage/GamePage";
import { slotGames } from "../../data/gamesData";

const cats = ["All Slots", "Classic", "Video Slots", "Megaways", "Jackpot", "New"];

const SlotPage = () => (
  <GamePage title="Slot Games" games={slotGames} categories={cats} />
);

export default SlotPage;
