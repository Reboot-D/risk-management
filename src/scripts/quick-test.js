const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Starting connection test...');
  try {
    const connection = await mysql.createConnection({
      host: 'gz-cdb-bh19rij3.sql.tencentcdb.com',
      port: 27323,
      user: 'root',
      password: 'AB8Vyft3koyn9x**h4PAw',
      database: 'risk_management',
      ssl: {
        rejectUnauthorized: false
      }
    });
    console.log('Connection established!');
    const [rows] = await connection.execute('SELECT 1');
    console.log('Query result:', rows);
    await connection.end();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('Connection failed:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname
    });
  }
}

testConnection(); 