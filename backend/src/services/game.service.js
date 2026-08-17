const Game = require("../models/Game");
const AuditLog = require("../models/AuditLog");

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const listGames = async (query) => {
  const { page = 1, limit = 50, category, subCategory, provider, search, status, isNew, isFeatured, isPopular } = query;
  const filter = {};
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (provider) filter.provider = provider;
  if (status) filter.status = status;
  if (isNew !== undefined) filter.isNew = isNew === "true";
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
  if (isPopular !== undefined) filter.isPopular = isPopular === "true";
  if (search) filter.name = new RegExp(search, "i");

  const skip = (Math.max(1, page) - 1) * Math.min(200, limit);
  const [games, total] = await Promise.all([
    Game.find(filter).skip(skip).limit(Math.min(200, limit)).sort({ sortOrder: 1, createdAt: -1 }),
    Game.countDocuments(filter),
  ]);
  return { games, total, page: Number(page), limit: Number(limit) };
};

const getGame = async (id) => {
  const game = await Game.findById(id);
  if (!game) throw Object.assign(new Error("Game not found"), { statusCode: 404 });
  return game;
};

const createGame = async (actor, data) => {
  const slug = data.slug || slugify(data.name);
  const game = await Game.create({ ...data, slug });
  await AuditLog.create({ actor: actor._id, action: "GAME_CREATE", target: "Game", targetId: game._id });
  return game;
};

const updateGame = async (actor, id, data) => {
  const game = await Game.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!game) throw Object.assign(new Error("Game not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "GAME_UPDATE", target: "Game", targetId: game._id });
  return game;
};

const deleteGame = async (actor, id) => {
  const game = await Game.findByIdAndDelete(id);
  if (!game) throw Object.assign(new Error("Game not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "GAME_DELETE", target: "Game", targetId: id });
};

const setGameStatus = async (actor, id, status) => {
  const game = await Game.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );
  if (!game) throw Object.assign(new Error("Game not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "GAME_STATUS_CHANGE", target: "Game", targetId: game._id, metadata: { status } });
  return game;
};

module.exports = { listGames, getGame, createGame, updateGame, deleteGame, setGameStatus };
