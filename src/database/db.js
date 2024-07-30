const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "b7xs5ntpimg6x3bnu6b1-mysql.services.clever-cloud.com",
    user: "ucnp05ftdnxppxd1",
    password: "kKX8R6gUtMS2kgMuLXUZ",
    database: "b7xs5ntpimg6x3bnu6b1",
});

module.exports = connection;
