const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neon-quiz-arena';
  const useTls = uri.includes('mongodb+srv') || uri.includes('ssl=true');

  const options = {
    connectTimeoutMS: 15000,
    serverSelectionTimeoutMS: 15000,
  };

  if (useTls) {
    options.tls = true;
    if (process.env.MONGODB_TLS_INSECURE === 'true') {
      options.tlsAllowInvalidCertificates = true;
    }
  }

  try {
    await mongoose.connect(uri, options);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    const msg = error.message || '';
    if (msg.includes('unable to verify the first certificate')) {
      console.warn(
        'MongoDB TLS certificate error. Set MONGODB_TLS_INSECURE=true in .env for local dev (corporate proxy/antivirus), or fix system CA certificates.'
      );
    } else {
      console.warn('MongoDB unavailable:', msg.split('\n')[0]);
    }
    return false;
  }
};

module.exports = connectDB;
