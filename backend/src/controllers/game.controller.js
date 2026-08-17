const gameService = require("../services/game.service");
const { success } = require("../utils/response");

const list = async (req, res, next) => {
  try {
    const result = await gameService.listGames(req.query);
    return success(res, result, "Games retrieved");
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const game = await gameService.getGame(req.params.id);
    return success(res, { game }, "Game retrieved");
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const game = await gameService.createGame(req.user, req.body);
    return success(res, { game }, "Game created", 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const game = await gameService.updateGame(req.user, req.params.id, req.body);
    return success(res, { game }, "Game updated");
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await gameService.deleteGame(req.user, req.params.id);
    return success(res, {}, "Game deleted");
  } catch (err) { next(err); }
};

const setStatus = async (req, res, next) => {
  try {
    const game = await gameService.setGameStatus(req.user, req.params.id, req.body.status);
    return success(res, { game }, "Game status updated");
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove, setStatus };
