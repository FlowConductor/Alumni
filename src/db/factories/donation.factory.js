// Donation Factory — generates fake donate records for seeding (see ddd.md).

const CAMPAIGNS = [
  'Scholarship Fund',
  'Computer Lab',
  'Student Club Support',
  'Library Expansion',
  'Guest Lecture Series',
  null,
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickStatus() {
  const roll = Math.random();
  if (roll < 0.85) return 'completed';
  if (roll < 0.95) return 'pending';
  return 'failed';
}

function make(count = 20, userIds = []) {
  if (userIds.length === 0) {
    throw new Error('donation factory requires at least one user id');
  }

  const donations = [];
  for (let i = 0; i < count; i++) {
    const amount = (50 + Math.random() * 4950).toFixed(2);
    donations.push({
      user_id: pick(userIds),
      amount: Number(amount),
      currency: 'TRY',
      campaign: pick(CAMPAIGNS),
      status: pickStatus(),
    });
  }

  return donations;
}

module.exports = { make };
