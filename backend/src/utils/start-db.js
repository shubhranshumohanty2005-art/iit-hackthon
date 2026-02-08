const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// This script starts an in-memory MongoDB instance
// Useful when a local MongoDB installation is not available

const startDB = async () => {
  try {
    console.log('Starting in-memory MongoDB server...');
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017, // Use default port to match existing config
      },
    });

    const uri = mongod.getUri();
    console.log(`InMemory MongoDB started at: ${uri}`);
    console.log('Use this URI in your .env file or application config.');
    
    // Keep the process alive
    process.on('SIGINT', async () => {
      console.log('Stopping in-memory MongoDB server...');
      await mongod.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start in-memory MongoDB:', error);
    process.exit(1);
  }
};

// Check if running directly
if (require.main === module) {
  startDB();
}

module.exports = startDB;
