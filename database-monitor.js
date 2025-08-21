#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Import models
import User from './api/models/User.js';
import Drill from './api/models/Drill.js';
import Attempt from './api/models/Attempt.js';

class DatabaseMonitor {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully!');
      console.log(`📊 Database: ${process.env.MONGO_DB_NAME || 'upivot'}`);
      console.log('🔗 Connection string:', process.env.MONGO_URI);
      console.log('');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  async showMainMenu() {
    console.log('🏥 INTERVIEW DRILLS DATABASE MONITOR');
    console.log('=====================================');
    console.log('');
    console.log('📋 Available Commands:');
    console.log('1. View all users');
    console.log('2. View all drills');
    console.log('3. View all attempts');
    console.log('4. View user statistics');
    console.log('5. View drill statistics');
    console.log('6. Search by email');
    console.log('7. View recent activity');
    console.log('8. Database health check');
    console.log('9. Exit');
    console.log('');

    const choice = await this.promptUser('Enter your choice (1-9): ');
    
    switch (choice) {
      case '1':
        await this.showAllUsers();
        break;
      case '2':
        await this.showAllDrills();
        break;
      case '3':
        await this.showAllAttempts();
        break;
      case '4':
        await this.showUserStatistics();
        break;
      case '5':
        await this.showDrillStatistics();
        break;
      case '6':
        await this.searchByEmail();
        break;
      case '7':
        await this.showRecentActivity();
        break;
      case '8':
        await this.databaseHealthCheck();
        break;
      case '9':
        console.log('👋 Goodbye!');
        await this.disconnect();
        process.exit(0);
        break;
      default:
        console.log('❌ Invalid choice. Please try again.');
    }

    console.log('');
    await this.promptUser('Press Enter to continue...');
    console.clear();
    await this.showMainMenu();
  }

  async showAllUsers() {
    console.log('\n👥 ALL USERS IN DATABASE');
    console.log('==========================');
    
    try {
      const users = await User.find({}).sort({ createdAt: -1 });
      
      if (users.length === 0) {
        console.log('No users found in the database.');
        return;
      }

      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'N/A'}`);
        console.log(`   Username: ${user.username || 'N/A'}`);
        console.log(`   Providers: ${user.providers?.join(', ') || 'N/A'}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}`);
        console.log(`   Picture: ${user.picture || 'N/A'}`);
      });

      console.log(`\n📊 Total Users: ${users.length}`);
    } catch (error) {
      console.error('❌ Error fetching users:', error.message);
    }
  }

  async showAllDrills() {
    console.log('\n📚 ALL DRILLS IN DATABASE');
    console.log('============================');
    
    try {
      const drills = await Drill.find({}).sort({ createdAt: -1 });
      
      if (drills.length === 0) {
        console.log('No drills found in the database.');
        return;
      }

      drills.forEach((drill, index) => {
        console.log(`\n${index + 1}. Drill ID: ${drill._id}`);
        console.log(`   Title: ${drill.title}`);
        console.log(`   Difficulty: ${drill.difficulty}`);
        console.log(`   Category: ${drill.category || 'N/A'}`);
        console.log(`   Tags: ${drill.tags?.join(', ') || 'N/A'}`);
        console.log(`   Questions: ${drill.questions?.length || 0}`);
        console.log(`   Total Points: ${drill.totalPoints || 0}`);
        console.log(`   Time Limit: ${drill.timeLimit || 'N/A'} seconds`);
        console.log(`   Created: ${drill.createdAt.toLocaleString()}`);
        console.log(`   Active: ${drill.isActive ? 'Yes' : 'No'}`);
      });

      console.log(`\n📊 Total Drills: ${drills.length}`);
    } catch (error) {
      console.error('❌ Error fetching drills:', error.message);
    }
  }

  async showAllAttempts() {
    console.log('\n📊 ALL ATTEMPTS IN DATABASE');
    console.log('==============================');
    
    try {
      const attempts = await Attempt.find({})
        .populate('userId', 'email name')
        .populate('drillId', 'title difficulty')
        .sort({ createdAt: -1 })
        .limit(20);

      if (attempts.length === 0) {
        console.log('No attempts found in the database.');
        return;
      }

      attempts.forEach((attempt, index) => {
        console.log(`\n${index + 1}. Attempt ID: ${attempt._id}`);
        console.log(`   User: ${attempt.userId?.email || 'Unknown'} (${attempt.userId?.name || 'N/A'})`);
        console.log(`   Drill: ${attempt.drillId?.title || 'Unknown'} (${attempt.drillId?.difficulty || 'N/A'})`);
        console.log(`   Score: ${attempt.score}%`);
        console.log(`   Correct: ${attempt.correctAnswers}/${attempt.totalQuestions}`);
        console.log(`   Time Spent: ${attempt.timeSpent} seconds`);
        console.log(`   Completed: ${attempt.completed ? 'Yes' : 'No'}`);
        console.log(`   Created: ${attempt.createdAt.toLocaleString()}`);
      });

      const totalAttempts = await Attempt.countDocuments({});
      console.log(`\n📊 Showing 20 of ${totalAttempts} total attempts`);
    } catch (error) {
      console.error('❌ Error fetching attempts:', error.message);
    }
  }

  async showUserStatistics() {
    console.log('\n📈 USER STATISTICS');
    console.log('==================');
    
    try {
      const totalUsers = await User.countDocuments({});
      const totalAttempts = await Attempt.countDocuments({});
      const avgAttemptsPerUser = totalUsers > 0 ? (totalAttempts / totalUsers).toFixed(2) : 0;

      console.log(`👥 Total Users: ${totalUsers}`);
      console.log(`📊 Total Attempts: ${totalAttempts}`);
      console.log(`📈 Average Attempts per User: ${avgAttemptsPerUser}`);

      // Top performing users
      const topUsers = await Attempt.aggregate([
        {
          $group: {
            _id: '$userId',
            totalAttempts: { $sum: 1 },
            averageScore: { $avg: '$score' },
            bestScore: { $max: '$score' }
          }
        },
        { $sort: { averageScore: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        }
      ]);

      if (topUsers.length > 0) {
        console.log('\n🏆 TOP PERFORMING USERS:');
        topUsers.forEach((user, index) => {
          const userInfo = user.userInfo[0];
          console.log(`${index + 1}. ${userInfo?.email || 'Unknown'}`);
          console.log(`   Average Score: ${user.averageScore.toFixed(1)}%`);
          console.log(`   Best Score: ${user.bestScore}%`);
          console.log(`   Total Attempts: ${user.totalAttempts}`);
        });
      }
    } catch (error) {
      console.error('❌ Error fetching user statistics:', error.message);
    }
  }

  async showDrillStatistics() {
    console.log('\n📊 DRILL STATISTICS');
    console.log('====================');
    
    try {
      const totalDrills = await Drill.countDocuments({});
      const activeDrills = await Drill.countDocuments({ isActive: true });
      const totalAttempts = await Attempt.countDocuments({});

      console.log(`📚 Total Drills: ${totalDrills}`);
      console.log(`✅ Active Drills: ${activeDrills}`);
      console.log(`📊 Total Attempts: ${totalAttempts}`);

      // Most attempted drills
      const popularDrills = await Attempt.aggregate([
        {
          $group: {
            _id: '$drillId',
            attempts: { $sum: 1 },
            averageScore: { $avg: '$score' }
          }
        },
        { $sort: { attempts: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'drills',
            localField: '_id',
            foreignField: '_id',
            as: 'drillInfo'
          }
        }
      ]);

      if (popularDrills.length > 0) {
        console.log('\n🔥 MOST POPULAR DRILLS:');
        popularDrills.forEach((drill, index) => {
          const drillInfo = drill.drillInfo[0];
          console.log(`${index + 1}. ${drillInfo?.title || 'Unknown'}`);
          console.log(`   Attempts: ${drill.attempts}`);
          console.log(`   Average Score: ${drill.averageScore.toFixed(1)}%`);
        });
      }
    } catch (error) {
      console.error('❌ Error fetching drill statistics:', error.message);
    }
  }

  async searchByEmail() {
    console.log('\n🔍 SEARCH USER BY EMAIL');
    console.log('========================');
    
    const email = await this.promptUser('Enter email to search: ');
    
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        console.log('❌ User not found.');
        return;
      }

      console.log('\n👤 USER FOUND:');
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Username: ${user.username || 'N/A'}`);
      console.log(`   Providers: ${user.providers?.join(', ') || 'N/A'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);

      // Get user's attempts
      const attempts = await Attempt.find({ userId: user._id })
        .populate('drillId', 'title difficulty')
        .sort({ createdAt: -1 });

      if (attempts.length > 0) {
        console.log(`\n📊 USER'S ATTEMPTS (${attempts.length}):`);
        attempts.forEach((attempt, index) => {
          console.log(`   ${index + 1}. ${attempt.drillId?.title || 'Unknown'}`);
          console.log(`      Score: ${attempt.score}% (${attempt.correctAnswers}/${attempt.totalQuestions})`);
          console.log(`      Time: ${attempt.timeSpent}s, Date: ${attempt.createdAt.toLocaleDateString()}`);
        });
      } else {
        console.log('\n📊 No attempts found for this user.');
      }
    } catch (error) {
      console.error('❌ Error searching user:', error.message);
    }
  }

  async showRecentActivity() {
    console.log('\n🕒 RECENT ACTIVITY');
    console.log('==================');
    
    try {
      const recentAttempts = await Attempt.find({})
        .populate('userId', 'email name')
        .populate('drillId', 'title difficulty')
        .sort({ createdAt: -1 })
        .limit(10);

      if (recentAttempts.length === 0) {
        console.log('No recent activity found.');
        return;
      }

      console.log('📊 Recent Drill Attempts:');
      recentAttempts.forEach((attempt, index) => {
        const timeAgo = this.getTimeAgo(attempt.createdAt);
        console.log(`   ${index + 1}. ${attempt.userId?.email || 'Unknown'} completed ${attempt.drillId?.title || 'Unknown'}`);
        console.log(`      Score: ${attempt.score}%, ${timeAgo}`);
      });
    } catch (error) {
      console.error('❌ Error fetching recent activity:', error.message);
    }
  }

  async databaseHealthCheck() {
    console.log('\n🏥 DATABASE HEALTH CHECK');
    console.log('=========================');
    
    try {
      // Check collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📁 Collections: ${collections.map(c => c.name).join(', ')}`);

      // Check document counts
      const userCount = await User.countDocuments({});
      const drillCount = await Drill.countDocuments({});
      const attemptCount = await Attempt.countDocuments({});

      console.log(`👥 Users: ${userCount}`);
      console.log(`📚 Drills: ${drillCount}`);
      console.log(`📊 Attempts: ${attemptCount}`);

      // Check database size
      const stats = await mongoose.connection.db.stats();
      console.log(`💾 Database Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📈 Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);

      // Check indexes
      const userIndexes = await User.collection.indexes();
      const drillIndexes = await Drill.collection.indexes();
      const attemptIndexes = await Attempt.collection.indexes();

      console.log(`🔍 User Indexes: ${userIndexes.length}`);
      console.log(`🔍 Drill Indexes: ${drillIndexes.length}`);
      console.log(`🔍 Attempt Indexes: ${attemptIndexes.length}`);

      console.log('\n✅ Database health check completed successfully!');
    } catch (error) {
      console.error('❌ Error during health check:', error.message);
    }
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  async promptUser(question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }
}

// Main execution
async function main() {
  const monitor = new DatabaseMonitor();
  
  try {
    await monitor.connect();
    await monitor.showMainMenu();
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    await monitor.disconnect();
    rl.close();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

// Run the monitor
main();
