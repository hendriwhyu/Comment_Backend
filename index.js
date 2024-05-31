const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const protectedRoutes = require('./routes/protectedRoute'); // Import rute yang dilindungi
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// Definisi Route
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/protected', protectedRoutes);

const PORT = process.env.PORT || 5000;

connectDB.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server berjalan pada port ${PORT}`));
});
