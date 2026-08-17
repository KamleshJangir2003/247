const bonusService = require("../services/bonus.service");
const { success } = require("../utils/response");

const list = async (req, res, next) => {
  try {
    const result = await bonusService.listBonuses(req.query);
    return success(res, result, "Bonuses retrieved");
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const bonus = await bonusService.getBonus(req.params.id);
    return success(res, { bonus }, "Bonus retrieved");
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const bonus = await bonusService.createBonus(req.user, req.body);
    return success(res, { bonus }, "Bonus created", 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const bonus = await bonusService.updateBonus(req.user, req.params.id, req.body);
    return success(res, { bonus }, "Bonus updated");
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await bonusService.deleteBonus(req.user, req.params.id);
    return success(res, {}, "Bonus deleted");
  } catch (err) { next(err); }
};

// Any authenticated user can redeem a bonus code
const apply = async (req, res, next) => {
  try {
    const { code, depositAmount = 0 } = req.body;
    const result = await bonusService.applyBonus(req.user._id, code, Number(depositAmount));
    return success(res, result, "Bonus applied successfully");
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove, apply };
