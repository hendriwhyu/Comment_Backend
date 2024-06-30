const fs = require('fs');
const path = require('path');
const prisma = require('../utils/Prisma');
const bcrypt = require('bcryptjs');

// Mendapatkan post dengan lazy loading

exports.getPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const now = new Date();

    // Cari post yang sudah berakhir
    const expiredPosts = await prisma.posts.findMany({
      where: {
        endDate: {
          lt: now,
        },
      },
      select: {
        id: true,
      },
    });

    const expiredPostIds = expiredPosts.map(post => post.id);

    // Hapus entri terkait di BookmarksOnPosts dan UserJoinEvents
    await prisma.bookmarksOnPosts.deleteMany({
      where: {
        postId: {
          in: expiredPostIds,
        },
      },
    });

    await prisma.userJoinEvents.deleteMany({
      where: {
        eventId: {
          in: expiredPostIds,
        },
      },
    });

    // Hapus post yang sudah berakhir
    await prisma.posts.deleteMany({
      where: {
        id: {
          in: expiredPostIds,
        },
      },
    });

    // Ambil post yang masih berlaku dengan pagination
    const posts = await prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        image: true,
        createdAt: true,
        owner: {
          select: {
            email: true,
            username: true,
            role: true,
            profile: {
              select: {
                photo: true,
                name: true,
                headTitle: true,
              },
            },
          },
        },
        bookmarks: true,
        participants: true,
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await prisma.posts.count({
      where: {
        endDate: {
          gte: now,
        },
      },
    });

    res.json({
      status: 'success',
      msg: 'Posts successfully retrieved',
      total: totalCount,
      pages: +page,
      data: posts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsByTrends = async (req, res) => {
  try {
    const postsTrends = await prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        image: true,
        createdAt: true,
        owner: {
          select: {
            email: true,
            username: true,
            role: true,
            profile: {
              select: {
                photo: true,
                name: true,
                headTitle: true,
              },
            },
          },
        },
        bookmarks: true,
        participants: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        comments: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    let posts = postsTrends.filter((post) => post._count.comments > 0);

    if (posts.length === 0) {
      posts = [];
    }

    res.json({ status: 'success', msg: 'Posts Trends fetched', data: posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsUpcoming = async (req, res) => {
  try {
    const postsUpcoming = await prisma.posts.findMany({
      where: {
        category: 'Event',
        AND: {
          endDate: {
            gte: new Date(),
          },
        },
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        image: true,
        createdAt: true,
        owner: {
          select: {
            email: true,
            username: true,
            role: true,
            profile: {
              select: {
                photo: true,
                name: true,
                headTitle: true,
              },
            },
          },
        },
        bookmarks: true,
        participants: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    res.json({
      status: 'success',
      msg: 'Posts Upcoming fetched',
      data: postsUpcoming,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsBookmarksByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // Mengecek apakah userId diberikan
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Mengambil postingan yang dibookmark oleh pengguna tertentu
    const bookmarkedPosts = await prisma.posts.findMany({
      where: {
        bookmarks: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        image: true,
        createdAt: true,
        owner: {
          select: {
            email: true,
            username: true,
            role: true,
            profile: {
              select: {
                photo: true,
                name: true,
                headTitle: true,
              },
            },
          },
        },
        bookmarks: true,
        participants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Jika tidak ada postingan yang dibookmark, kembalikan array kosong
    if (bookmarkedPosts.length === 0) {
      return res
        .status(200)
        .json({ status: 'success', msg: 'No posts found', data: [] });
    }

    // Mengembalikan hasil postingan yang dibookmark oleh user tertentu
    res.status(200).json({
      status: 'success',
      msg: 'Bookmarks fetched',
      data: bookmarkedPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
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
    const post = await prisma.posts.findUnique({
      where: { id: postId },
      include: {
        owner: {
          include: {
            profile: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            owner: {
              include: {
                profile: true,
              },
            },
          },
        },
        participants: {
          include: {
            owner: {
              include: {
                profile: true,
              },
            },
          },
        },
        bookmarks: true,
      },
    });

    if (!post) {
      return res.status(404).json({ status: 'error', msg: 'Post not found' });
    }

    // Transform response to exclude password
    const responseData = {
      ...post,
      owner: {
        ...post.owner,
        password: undefined,
      },
      comments: post.comments.map((comment) => ({
        ...comment,
        User: {
          ...comment.User,
          password: undefined,
        },
      })),
    };

    res.json({ status: 'success', data: responseData });
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
          bookmarks: true,
        },
      });
    }

    res.json({ status: 'success', msg: 'Posts fetched', data: posts });
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
      return res.status(404).json({ status: 'error', msg: 'posts not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Membuat post baru
exports.createPost = async (req, res) => {
  const { title, category, description, startDate, endDate, maxParticipants } = req.body;
  const ownerId = req.user.id;
  const fullPath = req.file ? path.basename(req.file.path) : null;

  const postData = {
    title,
    category,
    description,
    startDate: category === 'Event' ? startDate : undefined,
    endDate: category === 'Event' ? endDate : undefined,
    maxParticipants: category === 'Event' ? +maxParticipants : undefined,
    image: fullPath,
    owner: { connect: { id: ownerId } },
  };

  try {
    let newPost = await prisma.posts.create({
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        image: true,
        owner: {
          select: {
            email: true,
            username: true,
            role: true,
            profile: {
              select: {
                photo: true,
                name: true,
                headTitle: true,
              },
            },
          },
        },
        participants: true,
        bookmarks: true,
      },
      data: postData,
    });

    const ownerPost = await prisma.users.findFirst({
      where: { id: ownerId },
      select: {
        profile: {
          select: {
            photo: true,
            name: true,
            headTitle: true,
          },
        },
      },
    });

    newPost = { ...newPost, owner: ownerPost };
    res.json({ status: 'success', msg: 'Post created', data: newPost });
  } catch (err) {
    console.error(err.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).send('Server error');
  }
};

// Memperbarui post berdasarkan ID
exports.updatePost = async (req, res) => {
  let data = req.body;

  try {
    // Cari post lama berdasarkan ID
    let oldPost = await prisma.posts.findUnique({
      where: {
        id: req.params.postId,
      },
    });

    if (!oldPost) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Pastikan hanya owner yang dapat memperbarui post
    if (oldPost.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ msg: 'You are not authorized to update this post' });
    }

    // Periksa apakah ada gambar baru di dalam permintaan
    if (req.file) {
      // Dapatkan nama file gambar lama dari post lama
      const oldImage = oldPost.image;

      // Path gambar lama
      const oldImagePath = path.join(__dirname, '../assets', oldImage);

      // Hapus gambar lama jika ada
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Update data post dengan nama file gambar baru
      data.image = req.file.filename;
    }

    // Update data post di database
    let post = await prisma.posts.update({
      where: {
        id: req.params.postId,
      },
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        image: data.image,
        startDate: data.startDate,
        endDate: data.endDate,
        maxParticipants: +data.maxParticipants,
      },
    });

    res.json({ status: 'success', msg: 'Post updated', data: post });
  } catch (err) {
    console.error(err.message);
    if (req.file) {
      const tempPath = req.file.path;
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
    res.status(500).send('Server error');
  }
};
// Menghapus post berdasarkan ID
exports.deletePost = async (req, res) => {
  try {
    const post = await prisma.posts.findUnique({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Periksa apakah post memiliki gambar sebelum mencoba membuat path gambar
    if (post.image) {
      const imagePath = path.join(__dirname, '../assets', post.image);

      // Hapus gambar jika ada
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Hapus post dari database
    await prisma.posts.delete({
      where: { id: req.params.postId },
    });

    res.json({ status: 'success', msg: 'Post removed' });
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

    res.json({ status: 'success', msg: 'participant fetched', data: result });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsByUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const posts = await prisma.posts.findMany({
      where: { ownerId: userId },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        image: true,
        owner: {
          select: {
            username: true,
            email: true,
            id: true,
            role: true,
            profile: {
              select: {
                photo: true,
                name: true,
                headTitle: true,
              },
            },
          },
        },
        participants: true,
        bookmarks: true,
      },
    });
    res.json({ status: 'success', msg: 'Posts fetched', data: posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Membuat post bookmark
exports.createBookmark = async (req, res) => {
  const { postId } = req.params;

  try {
    // Periksa apakah pengguna telah login
    const userId = req.user.id;

    // Periksa apakah bookmark sudah ada
    const existingBookmark = await prisma.bookmarksOnPosts.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingBookmark) {
      return res.status(400).json({ msg: 'Bookmark already exists' });
    }

    // Buat bookmark baru
    const newBookmark = await prisma.bookmarksOnPosts.create({
      data: {
        postId,
        userId,
      },
    });

    res.json({ status: 'success', msg: 'Bookmark created', data: newBookmark });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.deleteBookmark = async (req, res) => {
  const { postId } = req.params;

  try {
    // Periksa apakah pengguna telah login
    const userId = req.user.id;

    // Buat bookmark baru
    const deleteBookmark = await prisma.bookmarksOnPosts.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    res.json({
      status: 'success',
      msg: 'Bookmark deleted',
      data: deleteBookmark,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
