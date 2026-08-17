const userService = require("../services/user.service");
const { success } = require("../utils/response");

const list = async (req, res, next) => {
  try {
    const result = await userService.listUsers(req.user, req.query);
    return success(res, result, "Users retrieved");
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.user, req.params.id);
    return success(res, { user }, "User retrieved");
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.user, req.body);
    return success(res, { user }, "User created", 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.user, req.params.id, req.body);
    return success(res, { user }, "User updated");
  } catch (err) { next(err); }
};

const setStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await userService.setStatus(req.user, req.params.id, status);
    return success(res, { user }, "User status updated");
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await userService.deleteUser(req.user, req.params.id);
    return success(res, {}, "User deleted");
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, setStatus, remove };
