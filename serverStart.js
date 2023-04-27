const connectToMongoDB = require('./database/connection');
const mongoose = require('mongoose');
require('dotenv').config();

async function startServer(app) {
  try {
    const uri = await connectToMongoDB();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const server = app.listen(4242, () => {
      console.log('Сервер запущен на порту 3000');
    });
    return server;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = startServer;