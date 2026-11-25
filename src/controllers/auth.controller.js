// Auth Controller — the self-service register flow (/register).
//
// Rules enforced here, before the model is called:
//   username  3-100 characters: letters, digits, dot, underscore, hyphen; unique
//   email     a valid address, at most 255 characters; unique
//   password  at least 8 characters, at least one letter and one digit
//   confirm   must match the password
//
// Registration always assigns the `alumni` role: a visitor can never choose a
// role for themselves (ddd.md section 8). The password is hashed with scrypt
// before it reaches the model, and the hash is never selected back out.

const UserModel = require('../models/user.model');
const { hashPassword } = require('../lib/password');

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,100}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 200;

function validate({ username, email, password, passwordConfirm }) {
  const errors = [];

  if (!username) {
    errors.push('Field "username" is required.');
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.push(
      'Field "username" must be 3 to 100 characters: letters, digits, dot, underscore, or hyphen.'
    );
  }

  if (!email) {
    errors.push('Field "email" is required.');
  } else if (email.length > 255 || !EMAIL_PATTERN.test(email)) {
    errors.push('Field "email" must be a valid email address.');
  }

  if (!password) {
    errors.push('Field "password" is required.');
  } else if (password.length < PASSWORD_MIN) {
    errors.push(`Field "password" must be at least ${PASSWORD_MIN} characters.`);
  } else if (password.length > PASSWORD_MAX) {
    errors.push(`Field "password" must be at most ${PASSWORD_MAX} characters.`);
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push('Field "password" must contain at least one letter and one digit.');
  }

  if (password !== passwordConfirm) {
    errors.push('Field "password_confirm" must match the password.');
  }

  return errors;
}

// GET /register — view: src/views/auth/register.ejs
function registerForm(req, res) {
  res.render('auth/register', { errors: [], values: { username: '', email: '' } });
}

// POST /register
async function register(req, res) {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();
  const password = req.body.password || '';
  const passwordConfirm = req.body.password_confirm || '';
  const values = { username, email };

  const errors = validate({ username, email, password, passwordConfirm });
  if (errors.length > 0) {
    return res.status(400).render('auth/register', { errors, values });
  }

  try {
    const user = await UserModel.create({
      username,
      email,
      password_hash: hashPassword(password),
      role: 'alumni',
    });

    return res.redirect(`/users?registered=${encodeURIComponent(user.username)}`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).render('auth/register', {
        errors: ['That username or email is already registered.'],
        values,
      });
    }
    throw err;
  }
}

module.exports = { registerForm, register };
