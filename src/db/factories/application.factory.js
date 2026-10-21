// Application Factory — generates fake job_applications records for seeding
// (see ddd.md). Guarantees unique (job_posting_id, user_id) pairs.

const STATUSES = ['pending', 'pending', 'pending', 'pending', 'reviewed', 'reviewed', 'reviewed', 'accepted', 'accepted', 'rejected'];

const COVER_LETTERS = [
  'I am an MIS graduate and would love to contribute to your team.',
  'Looking forward to discussing my background in information systems.',
  'I have hands-on experience with ERP and business analysis projects.',
  null,
  null,
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function make(count = 20, userIds = [], postingIds = []) {
  if (userIds.length === 0 || postingIds.length === 0) {
    throw new Error('application factory requires user ids and posting ids');
  }

  const applications = [];
  const usedPairs = new Set();

  let attempts = 0;
  while (applications.length < count && attempts < count * 20) {
    attempts++;
    const user_id = pick(userIds);
    const job_posting_id = pick(postingIds);
    const key = `${job_posting_id}-${user_id}`;

    if (usedPairs.has(key)) continue;
    usedPairs.add(key);

    applications.push({
      job_posting_id,
      user_id,
      status: pick(STATUSES),
      cover_letter: pick(COVER_LETTERS),
    });
  }

  return applications;
}

module.exports = { make };
