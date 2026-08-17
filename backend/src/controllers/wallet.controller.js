const walletService = require("../services/wallet.service");
const { success, error } = require("../utils/response");
const User = require("../models/User");
const { ROLE_LEVEL } = require("../middleware/role.middleware");

const getBalance = async (req, res, next) => {
  try {
    const targetId = req.params.userId || req.user._id;

    // If requesting someone else's balance, verify hierarchy ownership
    if (targetId.toString() !== req.user._id.toString()) {
      const target = await User.findById(targetId).select("parentId role");
      if (!target) return error(res, "User not found", 404);

      const actor = req.user;
      const actorLevel = ROLE_LEVEL[actor.role] || 0;
      const targetLevel = ROLE_LEVEL[target.role] || 0;

      // Must be higher level
      if (actorLevel <= targetLevel) return error(res, "Insufficient privileges", 403);

      // MASTER: target must be a direct agent child or a user under one of their agents
      if (actor.role === "MASTER") {
        const isDirectChild = target.parentId?.toString() === actor._id.toString();
        if (!isDirectChild) {
          // Check if target's parent is an agent under this master
          const parentAgent = await User.findById(target.parentId).select("parentId role");
          const isGrandchild = parentAgent?.role === "AGENT" && parentAgent.parentId?.toString() === actor._id.toString();
          if (!isGrandchild) return error(res, "User is not in your hierarchy", 403);
        }
      }

      // AGENT: target must be a direct user child
      if (actor.role === "AGENT") {
        if (target.parentId?.toString() !== actor._id.toString()) {
          return error(res, "User is not in your hierarchy", 403);
        }
      }
    }

    const wallet = await walletService.getBalance(targetId);
    return success(res, { wallet }, "Wallet retrieved");
  } catch (err) { next(err); }
};

const transfer = async (req, res, next) => {
  try {
    const { receiverId, amount } = req.body;
    const sender = req.user;

    const receiver = await User.findById(receiverId);
    if (!receiver) return next(Object.assign(new Error("Receiver not found"), { statusCode: 404 }));

    const senderLevel = ROLE_LEVEL[sender.role] || 0;
    const receiverLevel = ROLE_LEVEL[receiver.role] || 0;

    if (senderLevel <= receiverLevel) {
      return next(Object.assign(new Error("Can only transfer to a lower-level user"), { statusCode: 403 }));
    }

    // MASTER can only transfer to their direct agents
    if (sender.role === "MASTER" && receiver.parentId?.toString() !== sender._id.toString()) {
      return next(Object.assign(new Error("Receiver is not under your hierarchy"), { statusCode: 403 }));
    }

    // AGENT can only transfer to their direct users
    if (sender.role === "AGENT" && receiver.parentId?.toString() !== sender._id.toString()) {
      return next(Object.assign(new Error("Receiver is not under your hierarchy"), { statusCode: 403 }));
    }

    const result = await walletService.transfer(sender._id, receiverId, Number(amount), sender._id);
    return success(res, result, "Transfer successful");
  } catch (err) { next(err); }
};

module.exports = { getBalance, transfer };
