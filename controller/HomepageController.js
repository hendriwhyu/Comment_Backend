const prisma = require('../utils/Prisma');

const HomepageController = {
  getPostsAndUsers: async (req, res) => {
    try {
      const eventsPosts = await prisma.posts.findMany({
        where: {
          category: 'Event',
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              username: true,
              id: true,
              username: true,
              role: true,
              profile: {
                select: {
                  photo: true,
                  name: true,
                  headTitle: true,
                  phone: true,
                },
              },
            },
          },
        },
        take: 20,
      });

      const newsPosts = await prisma.posts.findMany({
        where: {
          category: 'News',
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              username: true,
              id: true,
              username: true,
              role: true,
              profile: {
                select: {
                  photo: true,
                  name: true,
                  headTitle: true,
                  phone: true,
                },
              },
            },
          },
        },
        take: 20,
      });

      const users = await prisma.users.findMany({
        take: 10,
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          username: true,
          role: true,
          profile: {
            select: {
              photo: true,
              name: true,
              headTitle: true,
              phone: true,
            },
          },
        },
      });

      const posts = [...eventsPosts, ...newsPosts];

      res.json({
        status: 'success',
        msg: 'Trends, posts, and users fetched',
        data: {
          posts,
          users,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
};

module.exports = HomepageController;
