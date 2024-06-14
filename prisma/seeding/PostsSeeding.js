const prisma = require('../../utils/Prisma');
const { faker } = require('@faker-js/faker'); // Import faker

function generateEventName() {
  const eventType = faker.helpers.arrayElement([
    'Workshop',
    'Conference',
    'Seminar',
    'Meetup',
    'Webinar',
    'Symposium',
    'Expo',
    'Forum',
    'Summit',
    'Convention'
  ]);
  const topic = faker.helpers.arrayElement([
    'Technology',
    'Healthcare',
    'Education',
    'Marketing',
    'Finance',
    'Innovation',
    'Environment',
    'Community',
    'Leadership',
    'Development'
  ]);
  const name = faker.company.name();

  return `${eventType} on ${topic} by ${name}`;
}

function generateVolunteerImage() {
  const keywords = ['volunteer', 'community', 'charity'];
  const keyword = faker.helpers.arrayElement(keywords);
  return faker.image.urlLoremFlickr({ category: keyword });
}
// Run the command to create 20 dummy posts
const createPosts = async () => {
  const userIds = await prisma.users.findMany({ select: { id: true } });
  const postData = Array.from({ length: 20 }, () => ({
    title: (faker.helpers.arrayElement(['Event', 'News']) === 'Event') ? generateEventName() : faker.lorem.sentence(),
    category: faker.helpers.arrayElement(['Event', 'News']),
    description: faker.lorem.paragraph(),
    startDate: faker.date.future().toISOString(), // Menggunakan toISOString() untuk mengonversi ke format ISO string
    endDate: faker.date.future().toISOString(),
    maxParticipants: faker.number.int({ min: 0, max: 100 }),
    image: generateVolunteerImage(),
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

