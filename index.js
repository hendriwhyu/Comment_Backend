const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const protectedRoutes = require('./routes/protectedRoute'); // Import rute yang dilindungi
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const cleanUpEvents = require('./utils/cleanup');

const app = express();

// Izin Cors
app.use(cors()); // Izi

// Init Middleware
app.use(express.json({ extended: false }));

// Definisi Route
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/protected', protectedRoutes);
app.use('/api/user-join-event', require('./routes/userJointEventRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));


// Start event cleanup process
cleanUpEvents();

const PORT = process.env.PORT || 5000;

connectDB.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server berjalan pada http://localhost:${PORT}`));
});
