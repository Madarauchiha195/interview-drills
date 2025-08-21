import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', false);
  const opts = { autoIndex: true, maxPoolSize: 10 };
  await mongoose.connect(uri, opts);
  mongoose.connection.on('error', (err) => console.error('Mongo error', err));
  process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}
