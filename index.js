const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const commentRoutes = require('./routes/commentRoutes');
const protectedRoutes = require('./routes/protectedRoute'); // Import rute yang dilindungi
const joinRoutes = require('./routes/userJoinEventRoutes');
const prisma = require('./utils/Prisma');
const cleanUpEvents = require('./utils/cleanup');
const homeRoutes = require('./routes/homeRoutes');
const HomepageController = require('./controller/HomepageController');

dotenv.config();

const app = express();

// Izin Cors
app.use(cors()); // Izin Cors

// Init Middleware
app.use(express.json({ extended: false }));

// Definisi Route
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/protected', protectedRoutes);
app.use('/api/join', joinRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/home', homeRoutes);

// Start event cleanup process
cleanUpEvents();

const PORT = process.env.PORT || 5000;

// Tambahkan koneksi Prisma ORM di sini jika diperlukan

app.listen(PORT, async () => {
  try {
    await prisma.$connect(); // Hubungkan ke database Prisma
    console.log(`Server berjalan pada http://localhost:${PORT}`);
  } catch (error) {
    console.error('Koneksi ke database gagal:', error);
  }
});
