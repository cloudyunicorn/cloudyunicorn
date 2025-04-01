require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const { exec } = require('child_process');

// Configuration
const API_BASE = process.env.NODE_ENV === 'production' 
  ? process.env.PRODUCTION_URL 
  : 'http://localhost:3000';

// Enhanced error handling
const handleError = (error) => {
  console.error('\n[ERROR DETAILS]');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  
  if (error.response) {
    console.error('\n[API RESPONSE ERROR]');
    console.error('URL:', error.config.url);
    console.error('Method:', error.config.method);
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else if (error.request) {
    console.error('\n[REQUEST ERROR]');
    console.error('Request:', error.request);
  }
  
  console.error('\n[ENVIRONMENT]');
  console.error('Node:', process.version);
  console.error('NODE_ENV:', process.env.NODE_ENV);
  console.error('API_BASE:', API_BASE);
};

// Process scheduled posts
const processPosts = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Checking for scheduled posts...`);
    const response = await axios.get(`${API_BASE}/api/posts/process-scheduled`);
    console.log(`Processed ${response.data.message}`);
  } catch (error) {
    handleError(error);
  }
};

// Health check
const healthCheck = async () => {
  try {
    await axios.get(`${API_BASE}/api/health`);
    return true;
  } catch (error) {
    handleError(error);
    return false;
  }
};

// Main execution
const main = async () => {
  console.log('Starting scheduled posts processor...');
  
  // Initial health check
  if (!await healthCheck()) {
    console.error('API health check failed. Exiting.');
    process.exit(1);
  }

  // Schedule job to run every minute
  cron.schedule('* * * * *', async () => {
    await processPosts();
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Stopping scheduled posts processor...');
    process.exit(0);
  });
};

main();
