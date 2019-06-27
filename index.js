console.log('Loading function');

const aws = require('aws-sdk');
const mysql = require('mysql');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
//const kms = new aws.KMS();

/*const decryptPassword = (password) => {
  kms.decrypt(password, function (err, data) {
    if (err) {
      console.log('Error in the decryption of the database password');
      callback(err);
    }
    return data;
  });
}*/

const connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    // password : decryptPassword(process.env.RDS_PASSWORD),
    port     : process.env.RDS_PORT
});

exports.handler = async (_, context, callback) => {
    const bucket = process.env.BUCKET_NAME;
    const date = new Date();
    const key = `export_table_name_${`${date.toLocaleDateString("fr-FR").split('/').join('-')}-${date.toLocaleTimeString("fr-FR")}`}`;
    let params = {
      Bucket: bucket,
      Key: key,
    };

    await connection.connect(function(err) {
        if (err) {
          console.error(`Database connection failed: ${err.stack}`);
          callback(err);
        }
        console.log('Connected to database.');
        await con.query("SELECT * FROM table_name", function (err, result) {
            if (err) {
              console.log("Error in the select table_name");
              callback(err);
            }
            params.data = result;
        });
    });

    console.log('Closing the database connection');
    connection.end();

    console.log(`Putting Object : ${key} in the bucket ${bucket}`);
    s3.putObject(params, function (err) {
        if (err) {
          console.log(`Error in ${context.functionName} : ${err}`);
          callback(err);
        }
    });
};
