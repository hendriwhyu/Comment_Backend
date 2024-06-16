const prisma = require('../utils/Prisma');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          profile: {
            select: {
              name: true,
              headTitle: true,
              phone: true,
              photo: true,
            },
          },
        },
      });
      res.json({ status: 'success', msg: 'Users fetched', data: users });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
  // @route    GET api/profile/me
  // @desc     Get user by Token
  // @access   Private
  getUserByToken: async (req, res) => {
    try {
      const { token } = req.headers; // Ambil token dari header
      const responseJWT = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.users.findUnique({
        where: { id: responseJWT.user.id },
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
              phone: true,
            },
          },
          recentEvents: {
            orderBy: {
              joinDate: 'desc',
            },
            include: {
              posts: true,
            },
            take: 5,
          },
        },
      }); // Cari user berdasarkan id
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json({ status: 'success', data: user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // @route    GET api/profile/:id
  // @desc     Get profile by ID
  // @access   Private
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
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
          recentEvents: {
            include: {
              owner: {
                select: {
                  username: true,
                  id: true,
                  username: true,
                  role: true,
                  profile: true,
                },
              },
            },
          },
          posts: {
            include: {
              owner: {
                select: {
                  username: true,
                  id: true,
                  username: true,
                  role: true,
                  profile: true,
                },
              },
            },
          },
        },
      });
      res.json({ status: 'success', msg: 'User fetched', data: user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // @route    POST api/profile
  // @desc     Create or update profile
  // @access   Private
  updateProfileByAuth: async (req, res) => {
    const { name, headTitle, phone, email, username } = req.body;
    try {
      // Update existing profile
      let profileUserUpdate = await prisma.users.update({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          profile: true,
        },
        data: {
          email,
          username,
          profile: {
            update: {
              name,
              headTitle,
              phone,
            },
          },
        },
      });
      return res.json({
        status: 'success',
        msg: 'User Profile updated',
        data: profileUserUpdate,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      // Verifikasi pengguna
      const user = await prisma.users.findUnique({
        where: {
          id: req.user.id,
        },
      });

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Verifikasi kata sandi lama
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Incorrect old password' });
      }

      // Validasi kata sandi baru
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ msg: 'New password must be at least 6 characters long' });
      }

      // Enkripsi kata sandi baru
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Perbarui kata sandi di basis data
      await prisma.users.update({
        where: {
          id: req.user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  // @route    DELETE api/profile/:id
  // @desc     Delete profile
  // @access   Private
  deleteUserProfile: async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: req.user.id,
        },
      });

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      await prisma.users.delete({
        where: { id: req.user.id },
      });
      res.json({ status: 'success', msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
};

module.exports = UserController;
