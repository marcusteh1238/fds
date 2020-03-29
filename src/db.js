const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    password: process.env.PGPASSWORD,

})

module.exports = {
    query: (text, params, callback) => {
      const start = Date.now()
      return pool.query(text, params, (err, res) => {
        if (err) {
            console.log(err)
            return;
        }
        const duration = Date.now() - start
        console.log('executed query', { text, duration, rows: res.rowCount })
        callback(err, res)
      })
    }
  }
