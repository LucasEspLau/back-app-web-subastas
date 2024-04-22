// conexion.mjs
import sql from 'mssql';
import 'dotenv/config';

// Configuración de la conexión a la base de datos
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    pool: {
        max: 10, // Número máximo de conexiones en el pool
        min: 0, // Número mínimo de conexiones en el pool
        idleTimeoutMillis: 30000 // Tiempo de espera para liberar una conexión inactiva
    }
};

const pool = new sql.ConnectionPool(dbConfig)
sql.globalConnectionPool = pool
pool.connect()
    .then(pool => {
        console.log('Conectado a MSSQL');
        return pool;
    })
    .catch(err => console.error('Error al conectar a la base de datos:', err));

export { sql, pool };
