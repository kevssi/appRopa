import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dal_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

// Intentar conectar a MySQL
try {
  pool = mysql.createPool(dbConfig);
  // Verificar ping
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
  isConnected = true;
  console.log('Conexión exitosa a la base de datos MySQL (dal_db)');
} catch (error) {
  console.warn('Aviso MySQL: No se pudo conectar a la base de datos local (' + error.message + ').');
  console.warn('Para conectar MySQL, importa dal_database.sql e inicia tu servidor MySQL (XAMPP, WAMP, Docker o MySQL Server).');
  console.log('Operando en modo de persistencia en memoria y almacenamiento local.');
  pool = null;
  isConnected = false;
}

export { pool, isConnected };
