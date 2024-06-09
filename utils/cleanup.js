const eventController = require('../controller/EventController');

const cleanUpEvents = () => {
  // Jalankan setiap hari atau sesuai kebutuhan
  setInterval(async () => {
    await eventController.cleanUpEvents();
  }, 24 * 60 * 60 * 1000); // Setiap 24 jam
};

module.exports = cleanUpEvents;
