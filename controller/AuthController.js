const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/Prisma');
const userSchema = require('../schema/user');

const AuthController = {
  register: async (req, res) => {
    try {
      const registerValidation = userSchema.required({
        email: true,
        username: true,
        password: true,
        role: true,
      });
      if (!req.body.email || !req.body.password || !req.body.username) {
        return res.status(400).json({
          status: 'error',
          errors: [
            { msg: 'Username is required', path: 'username', type: 'required' },
            { msg: 'Email is required', path: 'email', type: 'required' },
            { msg: 'Password is required', path: 'password', type: 'required' }
          ].filter(error => !req.body[error.path]), // Hanya tampilkan error untuk field yang tidak ada
        });
      }
      // Validate the request data with Zod schema
      const validateData = registerValidation.safeParse(req.body);

      // Check if validation failed
      if (!validateData.success) {
        return res.status(400).json({
          status: 'error',
          errors: validateData.error.issues.map((issue) => ({
            msg: issue.message,
            path: issue.path.join('.'),
            type: issue.code,
          })),
        });
      }

      const { username, email, password, role } = validateData.data;

      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          errors: [
            {
              msg:
                existingUser.username === username
                  ? 'Username already exists'
                  : 'Email already exists',
              path: existingUser.username === username ? 'username' : 'email',
              type: 'unique_violation',
            },
          ],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
        },
      });

      await prisma.profiles.create({
        data: {
          name: username,
          userId: newUser.id,
          photo: `https://api.dicebear.com/8.x/identicon/svg?seed=${username}`,
        },
      });

      res.json({
        status: 'success',
        message: 'User created successfully',
        userId: newUser.id,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: 'error',
        message: 'Server error',
        details: err.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const loginValidation = userSchema.pick({
        email: true,
        password: true,
      });

      if (!req.body.email || !req.body.password) {
        return res.status(400).json({
          status: 'error',
          errors: [
            { msg: 'Email is required', path: 'email', type: 'required' },
            { msg: 'Password is required', path: 'password', type: 'required' }
          ].filter(error => !req.body[error.path]), // Hanya tampilkan error untuk field yang tidak ada
        });
      }

      const validateData = loginValidation.safeParse(req.body);

      if (!validateData.success) {
        return res.status(400).json({
          status: 'error',
          errors: validateData.error.issues.map((issue) => ({
            msg: issue.message,
            path: issue.path.join('.'),
            type: issue.code,
          })),
        });
      }

      const { email, password } = validateData.data;

      const user = await prisma.users.findUnique({ where: { email } });

      if (!user) {
        console.log('User not found');
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password does not match');
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role, // Include role in the payload
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '6h' },
        (err, token) => {
          if (err) throw err;
          res.json({ status: 'success', token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
};

module.exports = AuthController;
