const { faker } = require('@faker-js/faker'); // Import faker
const bcrypt = require('bcryptjs'); // Import bcrypt
const prisma = require('./utils/Prisma');

// Run the command to create 10 user data
const createUserAndProfile = async () => {
  const usersData = Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync('password', 10), // Hash password dengan bcrypt.hashSync()
    role: faker.helpers.arrayElement(['user', 'company']), // Menggunakan faker.random.arrayElement() untuk memilih elemen acak
  }));

  // Membuat banyak entri dengan prisma.users.createMany()
  await prisma.users.createMany({
    data: usersData,
  });

  const profilesData = usersData.map((user) => ({
    name: user.username,
    userId: user.id,
  }));

  // Membuat banyak entri dengan prisma.profiles.createMany()
  await prisma.profiles.createMany({
    data: profilesData,
  });
};

const seed = async () => {
  await createUserAndProfile();
};

module.exports = seed;
