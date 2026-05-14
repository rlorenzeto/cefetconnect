import { createConnection } from 'mysql2/promise';
import * as path from 'path';
import * as fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

async function migrate() {
  const conn = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cefetconnect',
  });

  try {
    const [rows]: any = await conn.execute(
      `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'post_fotos' AND COLUMN_NAME = 'id_foto'`,
    );

    const currentType: string = rows[0]?.DATA_TYPE ?? '';

    if (currentType === 'varchar') {
      console.log('Migração já aplicada. id_foto já é VARCHAR.');
      return;
    }

    await conn.execute(`
      ALTER TABLE post_fotos
        DROP PRIMARY KEY,
        MODIFY COLUMN id_foto VARCHAR(255) NOT NULL,
        ADD PRIMARY KEY (id_foto)
    `);

    console.log('Migração aplicada com sucesso: id_foto agora é VARCHAR(255).');
  } finally {
    await conn.end();
  }
}

migrate().catch((err) => {
  console.error('Erro ao executar migração:', err.message);
  process.exit(1);
});
