const path = require('path');
const prisma = require('../utils/Prisma');

// Mendapatkan post dengan lazy loading
exports.getPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const now = new Date();

    // Hapus post yang sudah berakhir
    await prisma.posts.deleteMany({
      where: {
        endDate: {
          lt: now,
        },
      },
    });

    // Ambil post yang masih berlaku dengan pagination
    const posts = await prisma.posts.findMany({
      where: {
        endDate: {
          gt: now,
        },
      },
      include: {
        owner: true,
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        startDate: 'asc',
      },
    });

    const totalCount = await prisma.posts.count({
      where: {
        endDate: {
          gt: now,
        },
      },
    });

    const result = posts.map((post) => ({
      id: post.id,
      title: post.title,
      category: post.category,
      description: post.description,
      startDate: post.startDate,
      endDate: post.endDate,
      maxParticipants: post.maxParticipants,
      image: post.image,
      createdAt: post.createdAt,
      owner: {
        photo: post.owner.photo,
        name: post.owner.name,
        headTitle: post.owner.headTitle,
      },
      bookmarks: post.bookmarks,
      totalParticipants: post.totalParticipants,
    }));

    res.json({
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      data: result,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Menghapus post yang sudah melewati endDate
exports.cleanUpPosts = async () => {
  try {
    await prisma.posts.deleteMany({
      where: {
        endDate: {
          lt: new Date(),
        },
      },
    });
  } catch (err) {
    console.error('Error cleaning up posts:', err.message);
  }
};

exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const posts = await prisma.posts.findUnique({
      where: { id: postId },
      include: {
        owner: {
          include: {
            profile: true,
          },
        },
        comments: true,
        participants: true,
      },
    });

    if (!posts) {
      return res.status(404).json({ msg: 'post not found' });
    }

    res.json({ data: posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mendapatkan post berdasarkan title
exports.getPostByTitle = async (req, res) => {
  const { title } = req.query;

  try {
    let posts;

    if (title) {
      // Cari post berdasarkan kata kunci pada title
      posts = await prisma.posts.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        include: {
          owner: {
            select: {
              name: true,
              photo: true,
              headTitle: true,
            },
          },
          comments: true,
          participants: true,
        },
      });
    } else {
      // Ambil semua post jika tidak ada query parameter title
      posts = await prisma.posts.findMany({
        include: {
          owner: {
            include: {
              profile: true,
            },
          },
          comments: true,
          participants: true,
        },
      });
    }

    res.json({ data: posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mendapatkan post berdasarkan title (exact match)
exports.getPostByExactTitle = async (req, res) => {
  try {
    const posts = await prisma.posts.findUnique({
      where: { title: req.params.title },
    });

    if (!posts) {
      return res.status(404).json({ msg: 'posts not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Membuat post baru
exports.createPost = async (req, res) => {
  const {
    ownerId,
    title,
    category,
    description,
    startDate,
    endDate,
    maxParticipants,
  } = req.body;
  try {
    let newPost;
    let fullPath = null;
    if(req.file){
      const originalFileName = path.basename(req.file.path);
      const fileNameWithoutExtension = path.parse(originalFileName).name;
      const formattedFileName = `${fileNameWithoutExtension}.jpeg`;
      fullPath = `/assets/${formattedFileName}`;
    }
    if (category === 'Event') {
      newPost = await prisma.posts.create({
        data: {
          title,
          category,
          description,
          startDate,
          endDate,
          maxParticipants,
          image: fullPath,
          owner: {
            connect: { id: ownerId }, // Anda menggunakan ownerId untuk menghubungkan ke pengguna yang ada
          },
        },
      });
    } else {
      newPost = await prisma.posts.create({
        data: {
          title,
          category,
          description,
          image: fullPath,
          owner: {
            connect: { id: ownerId }, // Anda menggunakan ownerId untuk menghubungkan ke pengguna yang ada
          },
        },
      });
    }

    res.json({ status: 'success', msg: 'Post created', data: newPost });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Memperbarui post berdasarkan ID
exports.updatePost = async (req, res) => {
  const {
    title,
    category,
    description,
    startDate,
    endDate,
    maxParticipants,
    image,
  } = req.body;
  console.log(req.body);
  const postFields = {};
  if (title) postFields.title = title;
  if (category) postFields.category = category;
  if (description) postFields.description = description;
  if (startDate) postFields.startDate = startDate;
  if (endDate) postFields.endDate = endDate;
  if (maxParticipants) postFields.maxParticipants = maxParticipants;
  if (image) postFields.image = image;

  try {
    let post = await prisma.posts.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }

    post = await prisma.posts.update({
      where: {
        id: req.params.id,
      },
      data: postFields,
    });

    res.json({ msg: 'post updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Menghapus post berdasarkan ID
exports.deletePost = async (req, res) => {
  try {
    const post = await prisma.posts.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }

    await prisma.posts.delete({
      where: { id: req.params.id },
    });

    res.json({ msg: 'post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getParticipants = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }

    const participants = await prisma.userJoinPosts.findMany({
      where: { postId },
      include: {
        profile: {
          select: {
            photo: true,
            headTitle: true,
          },
        },
      },
    });

    const result = participants.map((participant) => ({
      photo: participant.profile.photo,
      headTitle: participant.profile.headTitle,
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await prisma.posts.findMany({
      where: { ownerId: userId },
    });
    res.json({ status: 'success', msg: 'Posts fetched', data: posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
