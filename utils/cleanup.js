const PostsController = require('../controller/PostsController');

const cleanUpEvents = () => {
  // Jalankan setiap hari atau sesuai kebutuhan
  setInterval(async () => {
    await PostsController.cleanUpPosts();
  }, 24 * 60 * 60 * 1000); // Setiap 24 jam
};

module.exports = cleanUpEvents;
