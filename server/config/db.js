const dns      = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);  // ← force Google DNS dans Node.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Atlas connecté : ${conn.connection.host}`);
    console.log(`   Base de données : ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ Connexion MongoDB échouée : ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;