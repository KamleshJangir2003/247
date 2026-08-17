const providerService = require("../services/gameProvider.service");
const { success } = require("../utils/response");

const list = async (req, res, next) => {
  try {
    const result = await providerService.listProviders(req.query);
    return success(res, result, "Providers retrieved");
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const provider = await providerService.getProvider(req.params.id);
    return success(res, { provider }, "Provider retrieved");
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const provider = await providerService.createProvider(req.user, req.body);
    return success(res, { provider }, "Provider created", 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const provider = await providerService.updateProvider(req.user, req.params.id, req.body);
    return success(res, { provider }, "Provider updated");
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await providerService.deleteProvider(req.user, req.params.id);
    return success(res, {}, "Provider deleted");
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove };
