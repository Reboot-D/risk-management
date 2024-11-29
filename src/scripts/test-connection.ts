import pool, { testConnection } from '../config/database';

console.log('Starting connection test...\n');

const test = async () => {
  try {
    const result = await testConnection();
    if (!result) {
      console.error('Connection test failed');
      process.exit(1);
    }
    process.exit(0);
  } catch (error: any) {
    console.error('Test failed with error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname,
      stack: error.stack
    });
    process.exit(1);
  }
};

test(); 