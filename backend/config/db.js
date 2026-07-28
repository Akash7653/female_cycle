import mongoose from 'mongoose';
import dns from 'node:dns';

function applyFallbackDnsForSrv(uri) {
  if (!uri?.startsWith('mongodb+srv://')) return;
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('🔎 Using fallback DNS servers for Atlas SRV resolution');
  } catch (err) {
    console.warn('⚠️ Failed to set fallback DNS servers:', err.message);
  }
}

export async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGO_URI / MONGODB_URI not set — server will run without database persistence.');
    return;
  }

  applyFallbackDnsForSrv(uri);

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
