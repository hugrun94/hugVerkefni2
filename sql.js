//sql.js
//tenging við gagnagrunn

const { Client } = process.env.DATABASE_URL || 'postgres://postgres:hugrun94@localhost/postgres';

async function insert(values) { // eslint-disable-line
  const client = new Client({ connectionString });
  client.connect();
  try {
    const res = await client.query('INSERT INTO form (nafn, email,kennitala,fjoldi) VALUES($1,$2,$3,$4)', values);
  } catch (err) {
    return -1;
  }
  await client.end();
}

async function select() {
  const client = new Client({ connectionString });
  client.connect();
  try {
    const res = await client.query('SELECT * FROM form');
    return res.rows;
  } catch (err) {
  }
  await client.end();
}

module.exports = {
  select,
  insert,
};