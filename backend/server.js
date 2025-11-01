
const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'passop';
const port = process.env.PORT || 5000;

let db;
let client;

// Connect MongoDB
async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    db = client.db(dbName);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}
connectDB();

// ---------------- ROUTES ---------------

// 📦 Get all passwords
app.get('/api/passwords', async (req, res) => {
  try {
    const passwords = await db.collection('passwords').find({}).toArray();
    res.json(passwords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching passwords' });
  }
});

// 💾 Save a new password
app.post('/api/passwords', async (req, res) => {
  try {
    const { site, username, password } = req.body;
    if (!site || !username || !password) {
      return res.status(400).json({ error: 'site, username and password are required' });
    }
    const result = await db.collection('passwords').insertOne({
      site,
      username,
      password,
      createdAt: new Date(),
    });
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving password' });
  }
});

// 🗑️ Delete a password 
app.delete("/api/passwords/:id", async (req, res) => {
  try {
    const deletedPassword = await Password.findByIdAndDelete(req.params.id);
    if (!deletedPassword) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✏️ Edit password 
app.put('/api/passwords/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { site, username, password } = req.body;
    const result = await db
      .collection('passwords')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { site, username, password, updatedAt: new Date() } }
      );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating password' });
  }
});

// ------------------------------------------
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Optional: handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (client) await client.close();
  process.exit(0);
});


