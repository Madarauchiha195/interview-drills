import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  username: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true
  },
  picture: String,
  providers: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create username from email if not provided
userSchema.pre('save', function(next) {
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0];
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
