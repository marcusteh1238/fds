const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    password: process.env.PGPASSWORD,

})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
