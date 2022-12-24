const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyparser.json());

// Node.js et le connecteur MySQL... 
const mysql = require('mysql2');
var config =
{
    // host: 'mydemoserver.mysql.database.azure.com',
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quizappbackend',
    port: 3306,
    // ssl: {ca: fs.readFileSync("your_path_to_ca_cert_file_BaltimoreCyberTrustRoot.crt.pem")}
};
const db = mysql.createConnection(config);
// https://learn.microsoft.com/fr-fr/azure/mysql/single-server/connect-nodejs

// check database connexion : 
db.connect((err) => {

    if (err) {
        console.log("!!! Cannot connect !!! Error:");
    }
    console.log("Connection established.");
});

// get data : 
app.get('/questions', (req, res)=>{
    console.log("Get all questions")
    readData()
})


function readData(){
    db.query('SELECT * FROM questions', 
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Selected ' + results.length + ' row(s).');
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done.');
        })
    db.end(
        function (err) { 
            if (err) throw err;
            else  console.log('Closing connection.') 
    });
};



app.listen(3000, () => {
    console.log("Server is running on 3000 port")
})

