const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL;


//DB Connection
// mongoose.connect(
//     // db_url,
//     // {
//     //     useNewUrlParser: true,
//     //     useFindAndModify: false,
//     //     useUnifiedTopology: true,
//     //     useCreateIndex: true
//     // },
//     // function (err, con) {
//     //     assert.strictEqual(err, null, 'DB Connect Fail..');
//     //     console.log('DB Connected..');
//     //     // console.log(con);
//     // }
// );

