/**
 * gameProvider.service.js
 * Clean interface for future game-provider API integration.
 * Replace the placeholder implementations with real provider SDK calls.
 */

const Provider = require("../models/Provider");

// Placeholder: launch a game session URL for a given provider
const launchGame = async (gameSlug, userId, providerSlug) => {
  // TODO: integrate real provider SDK (e.g. Evolution, Pragmatic, JILI)
  // Return a real launch URL from the provider API
  return {
    launchUrl: null,
    sessionId: null,
    message: "Game provider integration pending",
  };
};

// Placeholder: get game list from provider API
const fetchProviderGames = async (providerSlug) => {
  // TODO: call provider API to sync game catalog
  return [];
};

// Placeholder: handle provider callback (win/loss result)
const handleProviderCallback = async (payload) => {
  // TODO: validate provider signature, process game result, update wallet
  return { processed: false, message: "Provider callback integration pending" };
};

const listProviders = async (query = {}) => {
  const { page = 1, limit = 50, status } = query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
  const [providers, total] = await Promise.all([
    Provider.find(filter).skip(skip).limit(Math.min(100, limit)).sort({ name: 1 }),
    Provider.countDocuments(filter),
  ]);
  return { providers, total, page: Number(page), limit: Number(limit) };
};

const getProvider = async (id) => {
  const provider = await Provider.findById(id);
  if (!provider) throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  return provider;
};

const createProvider = async (actor, data) => {
  const AuditLog = require("../models/AuditLog");
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = data.slug || slugify(data.name);
  const provider = await Provider.create({ ...data, slug });
  await AuditLog.create({ actor: actor._id, action: "PROVIDER_CREATE", target: "Provider", targetId: provider._id });
  return provider;
};

const updateProvider = async (actor, id, data) => {
  const AuditLog = require("../models/AuditLog");
  const provider = await Provider.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!provider) throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "PROVIDER_UPDATE", target: "Provider", targetId: provider._id });
  return provider;
};

const deleteProvider = async (actor, id) => {
  const AuditLog = require("../models/AuditLog");
  const provider = await Provider.findByIdAndDelete(id);
  if (!provider) throw Object.assign(new Error("Provider not found"), { statusCode: 404 });
  await AuditLog.create({ actor: actor._id, action: "PROVIDER_DELETE", target: "Provider", targetId: id });
};

module.exports = { launchGame, fetchProviderGames, handleProviderCallback, listProviders, getProvider, createProvider, updateProvider, deleteProvider };
