import mongoose from 'mongoose';
import Drill from './models/Drill.js';
import User from './models/User.js';
import Attempt from './models/Attempt.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME || 'upivot';
    
    console.log('🔗 Connecting to MongoDB:', uri);
    console.log('📊 Database name:', dbName);
    
    await mongoose.connect(uri, {
      dbName: dbName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Available collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check drills
    const drillCount = await Drill.countDocuments();
    console.log(`\n📚 Drills count: ${drillCount}`);
    
    if (drillCount > 0) {
      const drills = await Drill.find({}, { title: 1, _id: 1 }).limit(5);
      console.log('📚 Sample drills:');
      drills.forEach(drill => {
        console.log(`  - ${drill.title} (${drill._id})`);
      });
    }
    
    // Check users
    const userCount = await User.countDocuments();
    console.log(`\n👤 Users count: ${userCount}`);
    
    if (userCount > 0) {
      const users = await User.find({}, { email: 1, name: 1, _id: 1 }).limit(5);
      console.log('👤 Sample users:');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ${user._id}`);
      });
    }
    
    // Check attempts
    const attemptCount = await Attempt.countDocuments();
    console.log(`\n📊 Attempts count: ${attemptCount}`);
    
    if (attemptCount > 0) {
      const attempts = await Attempt.find({}, { score: 1, userId: 1, drillId: 1, _id: 1 }).limit(5);
      console.log('📊 Sample attempts:');
      attempts.forEach(attempt => {
        console.log(`  - Score: ${attempt.score}, User: ${attempt.userId}, Drill: ${attempt.drillId}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugDatabase();
