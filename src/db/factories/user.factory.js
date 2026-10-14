// User Factory — generates fake user records for seeding (see ddd.md).

const FIRST_NAMES = [
  'Ahmet', 'Elif', 'Mert', 'Zeynep', 'Emre', 'Ayse', 'Burak', 'Ceren',
  'Deniz', 'Efe', 'Gizem', 'Kerem', 'Lale', 'Murat', 'Nil', 'Ozan',
  'Selim', 'Yasemin', 'Onur', 'Derya',
];

const LAST_NAMES = [
  'Yilmaz', 'Demir', 'Kaya', 'Arslan', 'Celik', 'Sahin', 'Yildiz',
  'Aydin', 'Ozturk', 'Aksoy', 'Erdem', 'Koc', 'Kurt', 'Simsek', 'Turan',
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function make(count = 10) {
  const users = [];
  const usedUsernames = new Set();

  for (let i = 0; i < count; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    let username = `${first}.${last}`.toLowerCase();
    let email = `${username}@example.com`;

    let n = 2;
    while (usedUsernames.has(username)) {
      username = `${first}.${last}${n}`.toLowerCase();
      email = `${username}@example.com`;
      n++;
    }

    usedUsernames.add(username);
    users.push({ username, email });
  }

  return users;
}

module.exports = { make };
