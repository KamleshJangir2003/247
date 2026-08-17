const Bonus = require("../models/Bonus");
const AuditLog = require("../models/AuditLog");
const walletService = require("./wallet.service");

const listBonuses = async (query = {}) => {
  const { page = 1, limit = 20, status } = query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
  const [bonuses, total] = await Promise.all([
    Bonus.find(filter).select("-redeemedBy").skip(skip).limit(Math.min(100, limit)).sort({ createdAt: -1 }),
    Bonus.countDocuments(filter),
  ]);
  return { bonuses, total, page: Number(page), limit: Number(limit) };
};

const getBonus = async (id) => {
  const bonus = await Bonus.findById(id).select("-redeemedBy");
  if (!bonus) throw Object.assign(new Error("Bonus not found"), { statusCode: 404 });
  return bonus;
};

const createBonus = async (actor, data) => {
  const bonus = await Bonus.create({ ...data, createdBy: actor._id });
  await AuditLog.create({ actor: actor._id, action: "BONUS_CREATE", target: "Bonus", targetId: bonus._id });
  return bonus;
};

const updateBonus = async (actor, id, data) => {
  // Prevent overwriting redemption tracking via update
  delete data.redeemedBy;
  const bonus = await Bonus.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!bonus) throw Object.assign(new Error("Bonus not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "BONUS_UPDATE", target: "Bonus", targetId: bonus._id });
  return bonus;
};

const deleteBonus = async (actor, id) => {
  const bonus = await Bonus.findByIdAndDelete(id);
  if (!bonus) throw Object.assign(new Error("Bonus not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "BONUS_DELETE", target: "Bonus", targetId: id });
};

/**
 * applyBonus — redeem a bonus code for a user.
 * depositAmount: the deposit amount to validate minDeposit requirement (pass 0 if not deposit-linked).
 */
const applyBonus = async (userId, code, depositAmount = 0) => {
  // Atomic: add userId to redeemedBy only if not already present
  const now = new Date();
  const bonus = await Bonus.findOneAndUpdate(
    {
      code: code.toUpperCase(),
      status: "active",
      redeemedBy: { $ne: userId },
      $or: [{ startDate: null }, { startDate: { $lte: now } }],
      $and: [
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    },
    { $addToSet: { redeemedBy: userId } },
    { new: true }
  );

  if (!bonus) {
    // Distinguish between "already redeemed" and "not found/expired"
    const exists = await Bonus.findOne({ code: code.toUpperCase() });
    if (!exists) throw Object.assign(new Error("Bonus code not found"), { statusCode: 404 });
    if (exists.status !== "active") throw Object.assign(new Error("Bonus is not active"), { statusCode: 400 });
    if (exists.redeemedBy.some((id) => id.toString() === userId.toString())) {
      throw Object.assign(new Error("Bonus already redeemed"), { statusCode: 409 });
    }
    throw Object.assign(new Error("Bonus is expired or not yet valid"), { statusCode: 400 });
  }

  // Validate maxRedemptions
  if (bonus.maxRedemptions > 0 && bonus.redeemedBy.length > bonus.maxRedemptions) {
    // Roll back the addToSet
    await Bonus.findByIdAndUpdate(bonus._id, { $pull: { redeemedBy: userId } });
    throw Object.assign(new Error("Bonus redemption limit reached"), { statusCode: 400 });
  }

  // Validate minDeposit
  if (bonus.minDeposit > 0 && depositAmount < bonus.minDeposit) {
    await Bonus.findByIdAndUpdate(bonus._id, { $pull: { redeemedBy: userId } });
    throw Object.assign(new Error(`Minimum deposit of ${bonus.minDeposit} required for this bonus`), { statusCode: 400 });
  }

  // Calculate bonus amount
  let bonusAmount = 0;
  if (bonus.percentage > 0) bonusAmount = (depositAmount * bonus.percentage) / 100;
  if (bonus.fixedAmount > 0) bonusAmount += bonus.fixedAmount;
  if (bonus.maxBonus > 0 && bonusAmount > bonus.maxBonus) bonusAmount = bonus.maxBonus;

  if (bonusAmount <= 0) {
    await Bonus.findByIdAndUpdate(bonus._id, { $pull: { redeemedBy: userId } });
    throw Object.assign(new Error("Bonus amount calculated to zero"), { statusCode: 400 });
  }

  // Credit wallet
  const { transaction } = await walletService.credit(
    userId,
    bonusAmount,
    "BONUS",
    `Bonus applied: ${bonus.code}`,
    null,
    { bonusId: bonus._id, code: bonus.code }
  );

  await AuditLog.create({
    actor: userId,
    action: "BONUS_APPLY",
    target: "Bonus",
    targetId: bonus._id,
    metadata: { bonusAmount, code: bonus.code },
  });

  return { bonus: { _id: bonus._id, code: bonus.code, name: bonus.name }, bonusAmount, transaction };
};

module.exports = { listBonuses, getBonus, createBonus, updateBonus, deleteBonus, applyBonus };
