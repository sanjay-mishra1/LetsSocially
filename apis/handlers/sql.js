const dotenv = require("dotenv");
var https = require("https");
dotenv.config();
const { DB_PASS, DB_USER, DB_NAME, PORT, SERVER } = process.env;
// const connectToDb = async () => {
//   let connection = await connect();
//   console.log("connected");
//   return connection;
// };
// async function connect() {
// return await mysql.createPool({
//   user: DB_USER,
//   password: DB_PASS,
//   database: DB_NAME,
//   port: PORT,
//   host: SERVER,
// });
//   return mysql.createConnection({
//     host: "localhost",
//     user: DB_USER,
//     password: DB_PASS,
//     database: DB_NAME,
//   });
// }
exports.getScreens = async (users) => {
  let result = await executeQuery(
    `SELECT screenId FROM screens WHERE userHandle IN (${users.map(
      (item) => `'${item}'`
    )}` + ") ORDER BY createdAt DESC"
  );

  return result.result;
};
exports.addScreens = async (data) => {
  let result = await executeQuery(
    `INSERT screens (screenId,createdAt,userHandle) VALUES ('${data.screenId}','${data.createdAt}','${data.userHandle}')`
  );

  return result;
};
exports.deleteScreen = async (screenId) => {
  let result = await executeQuery(
    `DELETE FROM screens WHERE screenId = '${screenId}'`
  );

  return result;
};
exports.addUser = async (data) => {
  let result = await executeQuery(
    `INSERT users (userHandle,follower) VALUES ('${data.handle}',0)`
  );

  return result;
};
exports.editUser = async (userHandle, value) => {
  let result = await executeQuery(
    `UPDATE users SET follower=follower+${value} WHERE userHandle='${userHandle}'`
  );

  return result;
};
exports.getSuggestions = async (users) => {
  let result = await executeQuery(
    `SELECT userHandle FROM users WHERE userHandle NOT IN (${users.map(
      (item) => `'${item}'`
    )}` + ") ORDER BY follower DESC LIMIT 10"
  );

  return result.result;
};
exports.test = async (data) => {
  let results = await executeQuery(data);

  return results;
};
const executeQuery = async (query) => {
  var responseData = [];
  return new Promise(function (resolve, reject) {
    var options = {
      method: "POST",
      hostname: "letssocially.000webhostapp.com",
      path: "/api/sql.php",
      headers: {
        "Content-Type": "application/json",
      },
      maxRedirects: 20,
    };
    var req = https
      .request(options, (response) => {
        response.setEncoding("utf8");
        response
          .on("data", (d) => {
            responseData.push(d);
            console.log("receive", d);
          })
          .on("end", function () {
            resolve(JSON.parse(responseData));
          });
      })
      .on("error", (e) => {
        console.error(e);
        reject(e);
      });
    var postData = JSON.stringify({ query: query });

    req.write(postData);

    req.end();
  });
};
