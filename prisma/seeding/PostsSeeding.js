const prisma = require('./utils/Prisma');
const { faker } = require('@faker-js/faker'); // Import faker

// Run the command to create 20 dummy posts
const createPosts = async () => {
  const userIds = await prisma.users.findMany({ select: { id: true } });
  const postData = Array.from({ length: 20 }, () => ({
    title: faker.lorem.sentence(),
    category: faker.helpers.arrayElement(['Event', 'News']),
    description: faker.lorem.paragraph(),
    startDate: faker.date.future().toISOString(), // Menggunakan toISOString() untuk mengonversi ke format ISO string
    endDate: faker.date.future().toISOString(),
    maxParticipants: faker.number.int({ min: 0, max: 100 }),
    image: faker.image.url(),
    ownerId: faker.helpers.arrayElement(userIds).id,
  }));

  // Membuat banyak entri dengan prisma.posts.createMany()
  await prisma.posts.createMany({
    data: postData,
  });
};

const seed = async () => {
  await createPosts();
};

module.exports = seed;

