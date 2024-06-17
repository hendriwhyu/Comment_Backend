const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const protectedRoutes = require('./routes/protectedRoute'); // Import rute yang dilindungi
const joinRoutes = require('./routes/userJoinEventRoutes');
const prisma = require('./utils/Prisma');
const cleanUpEvents = require('./utils/cleanup');
const homeRoutes = require('./routes/homeRoutes');
const path = require('path');

dotenv.config();

const app = express();

// Izin Corss
app.use(cors()); // Izin Cors

// Init Middleware
app.use(express.json({ extended: false }));

// Serving static files from the 'assets' folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Definisi Route
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/protected', protectedRoutes);
app.use('/api/events', joinRoutes);
app.use('/api/home', homeRoutes);

app.get('/', (req, res) => {
  res.send({
    status: 'success',
    msg: `Server berjalan pada ${process.env.NODE_ENV}`,
  });
});
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
