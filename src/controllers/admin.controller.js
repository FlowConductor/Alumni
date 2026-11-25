// Admin Controller — the administrator control panel served under /admin.
//
// Views: src/views/admin/*.ejs. Every route behind this controller is mounted with
// requireRole('admin') in src/routes/admin.js, so no handler re-checks the session;
// what each handler does check is the domain rules of ddd.md section 8:
//
//   - only an administrator assigns or changes a role
//   - an account can never change its own role
//   - the last remaining administrator cannot be demoted or deleted

const UserModel = require('../models/user.model');
const AnnouncementModel = require('../models/announcement.model');
const DonationModel = require('../models/donation.model');
const JobPostingModel = require('../models/jobPosting.model');
const ApplicationModel = require('../models/application.model');

const ROLES = UserModel.ROLES;
const APPLICATION_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];
const DONATION_STATUSES = ['pending', 'completed', 'failed'];

// A panel action answers with a redirect carrying a one-line outcome, so a form
// submission never ends on a stale page. The message is plain text in the query
// string, not a session flash: no extra dependency and it survives a refresh.
function back(res, path, params) {
  const query = new URLSearchParams(params).toString();
  return res.redirect(query ? `${path}?${query}` : path);
}

function fail(res, path, message) {
  return back(res, path, { error: message });
}

function done(res, path, message) {
  return back(res, path, { notice: message });
}

// Shared rule set for "change someone's role". Returns an error message or null.
async function roleChangeProblem(actor, target, role) {
  if (target.id === actor.id) {
    return 'You cannot change your own role. Ask another administrator.';
  }
  if (target.role === role) {
    return null;
  }
  if (target.role === 'admin' && (await UserModel.countByRole('admin')) <= 1) {
    return 'The last administrator cannot be demoted.';
  }
  return null;
}

// READ — the dashboard: every table the panel can reach, in one screen.
async function overview(req, res) {
  const [users, announcements, postings, applications, donations] = await Promise.all([
    UserModel.findAll(),
    AnnouncementModel.findAll(),
    JobPostingModel.findAll(),
    ApplicationModel.findAll(),
    DonationModel.findAll(),
  ]);

  const byRole = ROLES.map((role) => ({
    role,
    total: users.filter((user) => user.role === role).length,
  }));

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const openPostings = postings.filter((posting) => posting.status === 'open').length;
  const pendingApplications = applications.filter((application) => application.status === 'pending').length;

  res.render('admin/overview', {
    notice: req.query.notice || null,
    error: req.query.error || null,
    counts: {
      users: users.length,
      announcements: announcements.length,
      postings: postings.length,
      applications: applications.length,
      donations: donations.length,
      totalDonations,
    },
    byRole,
    openPostings,
    pendingApplications,
    recentApplications: applications.slice(-6).reverse(),
    recentDonations: donations.slice(-6).reverse(),
  });
}

// READ — users and their roles (the only writable column here).
async function users(req, res) {
  res.render('admin/users', {
    users: await UserModel.findAll(),
    roles: ROLES,
    notice: req.query.notice || null,
    error: req.query.error || null,
  });
}

// UPDATE — assign a role.
async function updateRole(req, res) {
  const id = Number(req.params.id);
  const role = String(req.body.role || '');

  if (!Number.isInteger(id) || id < 1) {
    return fail(res, '/admin/users', 'A valid user id is required.');
  }
  if (!ROLES.includes(role)) {
    return fail(res, '/admin/users', `Role must be one of: ${ROLES.join(', ')}.`);
  }

  const target = await UserModel.findById(id);
  if (!target) {
    return fail(res, '/admin/users', `No user with id ${id}.`);
  }

  const problem = await roleChangeProblem(req.session.user, target, role);
  if (problem) {
    return fail(res, '/admin/users', problem);
  }

  await UserModel.update(id, { role });
  return done(res, '/admin/users', `${target.username} is now ${role}.`);
}

// CREATE — a donation recorded on a member's behalf (the fundraising bookkeeping
// the staff does when a transfer arrives outside the portal).
async function createDonation(req, res) {
  const userId = Number(req.body.user_id);
  const amount = Number(req.body.amount);
  const currency = String(req.body.currency || 'TRY').trim().toUpperCase() || 'TRY';
  const campaign = String(req.body.campaign || '').trim() || null;
  const status = String(req.body.status || 'pending');

  if (!Number.isInteger(userId) || userId < 1) {
    return fail(res, '/admin/donations', 'Choose the member who donated.');
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return fail(res, '/admin/donations', 'Amount must be a number greater than zero.');
  }
  if (!DONATION_STATUSES.includes(status)) {
    return fail(res, '/admin/donations', `Status must be one of: ${DONATION_STATUSES.join(', ')}.`);
  }
  if (!(await UserModel.findById(userId))) {
    return fail(res, '/admin/donations', `No user with id ${userId}.`);
  }

  const donation = await DonationModel.create({ user_id: userId, amount, currency, campaign, status });
  return done(res, '/admin/donations', `Recorded ${donation.amount} ${donation.currency} for ${donation.donorUsername}.`);
}

// UPDATE — the payment status of a recorded donation.
async function updateDonationStatus(req, res) {
  const id = Number(req.params.id);
  const status = String(req.body.status || '');

  if (!DONATION_STATUSES.includes(status)) {
    return fail(res, '/admin/donations', `Status must be one of: ${DONATION_STATUSES.join(', ')}.`);
  }

  const updated = Number.isInteger(id) ? await DonationModel.update(id, { status }) : null;
  if (!updated) {
    return fail(res, '/admin/donations', `No donation with id ${req.params.id}.`);
  }

  return done(res, '/admin/donations', `Donation ${id} is now ${status}.`);
}

// DELETE — remove a mis-keyed donation. Refused once the money is completed, since
// that row is accounting history.
async function removeDonation(req, res) {
  const id = Number(req.params.id);
  const donation = Number.isInteger(id) ? await DonationModel.findById(id) : null;

  if (!donation) {
    return fail(res, '/admin/donations', `No donation with id ${req.params.id}.`);
  }
  if (donation.status === 'completed') {
    return fail(res, '/admin/donations', 'A completed donation is accounting history and cannot be deleted.');
  }

  await DonationModel.remove(id);
  return done(res, '/admin/donations', `Donation ${id} removed.`);
}

// READ — every application, newest first, for triage.
async function applications(req, res) {
  res.render('admin/applications', {
    applications: (await ApplicationModel.findAll()).reverse(),
    statuses: APPLICATION_STATUSES,
    notice: req.query.notice || null,
    error: req.query.error || null,
  });
}

// UPDATE — move an application through the hiring pipeline.
async function updateApplicationStatus(req, res) {
  const id = Number(req.params.id);
  const status = String(req.body.status || '');

  if (!APPLICATION_STATUSES.includes(status)) {
    return fail(res, '/admin/applications', `Status must be one of: ${APPLICATION_STATUSES.join(', ')}.`);
  }

  const updated = Number.isInteger(id) ? await ApplicationModel.update(id, { status }) : null;
  if (!updated) {
    return fail(res, '/admin/applications', `No application with id ${req.params.id}.`);
  }

  return done(res, '/admin/applications', `Application ${id} is now ${status}.`);
}

// DELETE — close an application record (the posting itself is managed at
// /job-postings, where the foreign-key restriction is already handled).
async function removeApplication(req, res) {
  const id = Number(req.params.id);
  const removed = Number.isInteger(id) ? await ApplicationModel.remove(id) : null;

  if (!removed) {
    return fail(res, '/admin/applications', `No application with id ${req.params.id}.`);
  }

  return done(res, '/admin/applications', `Application ${id} removed.`);
}

// DELETE — an account. Foreign keys still protect records that reference it.
async function removeUser(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return fail(res, '/admin/users', 'A valid user id is required.');
  }
  if (id === req.session.user.id) {
    return fail(res, '/admin/users', 'You cannot delete your own account.');
  }

  const target = await UserModel.findById(id);
  if (!target) {
    return fail(res, '/admin/users', `No user with id ${id}.`);
  }
  if (target.role === 'admin' && (await UserModel.countByRole('admin')) <= 1) {
    return fail(res, '/admin/users', 'The last administrator cannot be deleted.');
  }

  try {
    await UserModel.remove(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return fail(res, '/admin/users', `${target.username} still has donations or applications; delete those first.`);
    }
    throw err;
  }

  return done(res, '/admin/users', `${target.username} deleted.`);
}

// READ — donations, with the record form the secretariat needs.
async function donations(req, res) {
  const [donations, users] = await Promise.all([DonationModel.findAll(), UserModel.findAll()]);

  res.render('admin/donations', {
    donations: donations.reverse(),
    users,
    statuses: DONATION_STATUSES,
    notice: req.query.notice || null,
    error: req.query.error || null,
  });
}

module.exports = {
  overview,
  users,
  updateRole,
  removeUser,
  applications,
  updateApplicationStatus,
  removeApplication,
  donations,
  createDonation,
  updateDonationStatus,
  removeDonation,
};
