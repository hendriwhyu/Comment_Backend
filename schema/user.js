const { z } = require("zod");

const userSchema = z.object({
  username: z
    .string({ message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(255, { message: 'Username must not exceed 255 characters' }),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email must not exceed 255 characters' }),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['user', 'admin']).optional(),
});

module.exports = userSchema;