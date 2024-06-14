const prisma = require('./utils/Prisma');
const createUser = require('./seeding/UserSeeding');
const createPost = require('./seeding/PostsSeeding');

class DatabaseSeeder {
  async seed() {
    await createUser();
    await createPost();
  }
}

async function main() {
  const seed = new DatabaseSeeder();
  await seed.seed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
