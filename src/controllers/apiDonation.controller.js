// ApiDonation Controller — handles the JSON API surface for donations.
// Direct routes: /api/donations. Nested route: /api/users/:userId/donations.

const DonationModel = require('../models/donation.model');
const UserModel = require('../models/user.model');

const STATUSES = ['pending', 'completed', 'failed'];

function idParamOr400(req, res, name = 'id') {
  const id = Number(req.params[name]);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: `Route parameter "${name}" must be a positive integer.` });
    return null;
  }
  return id;
}

// DIRECT: GET /api/donations
async function getAll(req, res) {
  res.json(await DonationModel.findAll());
}

// DIRECT: GET /api/donations/:id
async function getById(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const donation = await DonationModel.findById(id);
  if (!donation) {
    return res.status(404).json({ error: `Donation with id ${id} not found.` });
  }

  res.json(donation);
}

// NESTED: GET /api/users/:userId/donations
async function getByUser(req, res) {
  const userId = idParamOr400(req, res, 'userId');
  if (userId === null) return;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: `User with id ${userId} not found.` });
  }

  res.json(await DonationModel.findByUser(userId));
}

// DIRECT: POST /api/donations
async function create(req, res) {
  const { user_id, amount, currency, campaign, status } = req.body || {};

  if (!Number.isInteger(user_id) || user_id < 1) {
    return res.status(400).json({ error: 'Field "user_id" must be a positive integer.' });
  }
  if (amount === undefined || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Field "amount" must be a number greater than zero.' });
  }
  if (currency !== undefined && typeof currency !== 'string') {
    return res.status(400).json({ error: 'Field "currency" must be a string.' });
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Field "status" must be one of: pending, completed, failed.' });
  }

  let created;
  try {
    created = await DonationModel.create({
      user_id,
      amount: Number(amount),
      ...(currency !== undefined && { currency }),
      ...(campaign !== undefined && { campaign }),
      ...(status !== undefined && { status }),
    });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: `User with id ${user_id} not found.` });
    }
    throw err;
  }

  res.status(201).json(created);
}

// DIRECT: PUT/PATCH /api/donations/:id
async function update(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const { amount, currency, campaign, status } = req.body || {};

  if (amount !== undefined && (!Number.isFinite(Number(amount)) || Number(amount) <= 0)) {
    return res.status(400).json({ error: 'Field "amount" must be a number greater than zero.' });
  }
  if (currency !== undefined && typeof currency !== 'string') {
    return res.status(400).json({ error: 'Field "currency" must be a string.' });
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Field "status" must be one of: pending, completed, failed.' });
  }

  const updated = await DonationModel.update(id, {
    ...(amount !== undefined && { amount: Number(amount) }),
    ...(currency !== undefined && { currency }),
    ...(campaign !== undefined && { campaign }),
    ...(status !== undefined && { status }),
  });

  if (!updated) {
    return res.status(404).json({ error: `Donation with id ${id} not found.` });
  }

  res.json(updated);
}

// DIRECT: DELETE /api/donations/:id
async function remove(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const removed = await DonationModel.remove(id);
  if (!removed) {
    return res.status(404).json({ error: `Donation with id ${id} not found.` });
  }

  res.json(removed);
}

module.exports = { getAll, getById, getByUser, create, update, remove };
