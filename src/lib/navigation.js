// Navigation model — which menu items a visitor sees, decided by role.
//
// The lists below are the whole navigation: a page renders them, it does not
// hardcode links. Each item names the roles that may see it, and the rules mirror
// the guards in src/middleware/auth.js and the matrix in ddd.md section 8 — a link
// is offered exactly when its target would not answer 401/403.
//
// Three groups, rendered in this order:
//   primary  the product surface, public or signed-in
//   manage   write actions, staff and administrators only
//   utility  documentation and the API browser
//
// `roles` omitted means everyone, including anonymous visitors. A signed-in role
// that is not listed never sees the item, so a new role cannot inherit a menu by
// accident.

const ROLES = ['alumni', 'employer', 'staff', 'admin'];

const STAFF_ONLY = ['staff', 'admin'];
const ADMIN_ONLY = ['admin'];

const PRIMARY = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'users', label: 'Users', href: '/users', roles: ROLES },
  { key: 'announcements', label: 'Announcements', href: '/announcements' },
  { key: 'job-postings', label: 'Job postings', href: '/job-postings' },
  { key: 'about', label: 'About', href: '/about' },
];

const MANAGE = [
  { key: 'new-announcement', label: 'New announcement', href: '/announcements/new', roles: STAFF_ONLY },
  { key: 'new-posting', label: 'New posting', href: '/job-postings/new', roles: STAFF_ONLY },
  { key: 'new-user', label: 'New user', href: '/users/new', roles: STAFF_ONLY },
  { key: 'admin', label: 'Admin', href: '/admin', roles: ADMIN_ONLY },
];

const UTILITY = [{ key: 'api', label: 'API', href: '/api-docs' }];

function visible(item, role) {
  if (!item.roles) {
    return true;
  }
  return Boolean(role) && item.roles.includes(role);
}

function pick(items, role) {
  return items.filter((item) => visible(item, role)).map(({ key, label, href }) => ({ key, label, href }));
}

// navigationFor(null) is the anonymous menu; navigationFor(req.session.user) the
// signed-in one. `role` is returned too, so a template can label the menu.
function navigationFor(user) {
  const role = user ? user.role : null;

  return {
    role,
    signedIn: Boolean(user),
    primary: pick(PRIMARY, role),
    manage: pick(MANAGE, role),
    utility: pick(UTILITY, role),
  };
}

module.exports = { ROLES, PRIMARY, MANAGE, UTILITY, navigationFor };
