// Job Posting Factory — generates fake job_postings records for seeding (see ddd.md).

const TITLES = [
  'Data Analyst', 'ERP Consultant', 'IT Auditor', 'Business Analyst',
  'Software Developer', 'Database Administrator', 'Project Manager',
  'Systems Analyst', 'Cybersecurity Specialist', 'BI Developer',
];

const COMPANIES = [
  'Acme', 'Biz Teknoloji', 'Delta Soft', 'Efe Group', 'Kaya Holding',
  'Marmara Tech', 'Nova Systems', 'Ozturk Logistics', 'Pera Digital', 'Vega Consulting',
];

const LOCATIONS = ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Remote', null];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function make(count = 10, userIds = []) {
  const postings = [];

  for (let i = 0; i < count; i++) {
    const title = pick(TITLES);
    const company = pick(COMPANIES);
    const usePoster = userIds.length > 0 && Math.random() < 0.6;

    postings.push({
      posted_by: usePoster ? pick(userIds) : null,
      title,
      company,
      description: `${company} is looking for a ${title} to join the MIS team.`,
      location: pick(LOCATIONS),
      status: Math.random() < 0.85 ? 'open' : 'closed',
    });
  }

  return postings;
}

module.exports = { make };
