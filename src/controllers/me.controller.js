// Me Controller — the pages a signed-in member owns: their own record, their
// applications, and their donations.
//
// Every handler works on req.session.user.id, never on a route parameter, so a
// member cannot address somebody else's record by editing a URL. Reading the whole
// directory stays available at /users/<id>; writing another account stays staff
// work at /users/<id>/edit. Editing your own identity is allowed for every role
// (ddd.md section 8, "Edit own profile").

const UserModel = require('../models/user.model');
const DonationModel = require('../models/donation.model');
const ApplicationModel = require('../models/application.model');
const JobPostingModel = require('../models/jobPosting.model');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,100}$/;

const SESSION_USER = 'user';

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

// READ — my record, my applications, my donations, and any postings I published.
async function profile(req, res) {
  const user = await UserModel.findById(req.session.user.id);

  // The session can outlive the account (deleted by an administrator). Rather than
  // render a broken page, end the session and send the visitor to sign in again.
  if (!user) {
    return req.session.destroy(() => res.redirect('/login'));
  }

  const [applications, donations, postings] = await Promise.all([
    ApplicationModel.findByUser(user.id),
    DonationModel.findByUser(user.id),
    JobPostingModel.findByUser(user.id),
  ]);

  res.render('me/profile', {
    user,
    applications: applications.reverse(),
    donations: donations.reverse(),
    postings,
    donationsTotal: donations.reduce((sum, donation) => sum + donation.amount, 0),
    notice: req.query.notice || null,
    error: req.query.error || null,
  });
}

// UPDATE (form view)
async function editForm(req, res) {
  const user = await UserModel.findById(req.session.user.id);
  if (!user) {
    return req.session.destroy(() => res.redirect('/login'));
  }

  res.render('me/edit', {
    user,
    values: { username: user.username, email: user.email },
    errors: [],
  });
}

// UPDATE (form). Only the fields a member may change about themselves: the role
// and the password hash are not part of this body.
async function update(req, res) {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();

  const errors = [];
  if (!username) {
    errors.push('Field "username" is required.');
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.push('Username must be 3 to 100 characters: letters, digits, dot, underscore, or hyphen.');
  }
  if (!email) {
    errors.push('Field "email" is required.');
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.push('Field "email" must be a valid email address.');
  }

  if (errors.length > 0) {
    return res.status(400).render('me/edit', {
      user: await UserModel.findById(req.session.user.id),
      values: { username, email },
      errors,
    });
  }

  let updated;
  try {
    updated = await UserModel.update(req.session.user.id, { username, email });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).render('me/edit', {
        user: await UserModel.findById(req.session.user.id),
        values: { username, email },
        errors: ['That username or email already belongs to another account.'],
      });
    }
    throw err;
  }

  if (!updated) {
    return req.session.destroy(() => res.redirect('/login'));
  }

  // Keep the session in step with the record, otherwise the navigation would keep
  // showing the old username until the next sign-in.
  req.session[SESSION_USER] = { id: updated.id, username: updated.username, role: updated.role };
  await saveSession(req);

  res.redirect('/me?notice=Your record was updated.');
}

module.exports = { profile, editForm, update };
