import mysql from 'mysql2/promise';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

const testDirectConnection = async () => {
  console.log('Testing direct connection...');
  console.log('Target:', {
    host: 'gz-cdb-bh19rij3.sql.tencentcdb.com',
    port: 27323,
    database: 'risk_management'
  });
  
  try {
    // 首先进行 DNS 查找
    try {
      const { address, family } = await lookup('gz-cdb-bh19rij3.sql.tencentcdb.com');
      console.log('DNS lookup result:', { address, family });
    } catch (dnsError) {
      console.error('DNS lookup failed:', dnsError);
    }

    console.log('Attempting to create connection...');
    const connection = await mysql.createConnection({
      host: 'gz-cdb-bh19rij3.sql.tencentcdb.com',
      port: 27323,
      user: 'root',
      password: 'AB8Vyft3koyn9x**h4PAw',
      database: 'risk_management',
      ssl: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      connectTimeout: 20000,  // 增加超时时间
      debug: ['ComQueryPacket', 'RowDataPacket'],
      trace: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true,
      multipleStatements: false,
      timezone: '+08:00'
    });

    console.log('Connection established, testing query...');
    const [rows] = await connection.query({
      sql: 'SELECT 1',
      timeout: 10000
    });
    console.log('Query result:', rows);

    await connection.end();
    console.log('Connection closed successfully');
    return true;
  } catch (error: any) {
    console.error('Direct connection test failed:', {
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

// 执行测试并等待结果
console.log('Starting connection test...');
testDirectConnection().then(success => {
  console.log('Test completed:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test error:', error);
  process.exit(1);
}); 