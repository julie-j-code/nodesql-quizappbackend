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

// get all data : 
app.get('/questions', (req, res) => {
    console.log("Get all questions")
    let qr = 'SELECT * FROM questions'
    db.query(qr, (err, results) => {
        if (err) {
            console.log(err, 'error');
        }
        if (results.length > 0) {
            res.send({
                message: "All questions data",
                data: results
            })
        }
    })

})


// function readData(){
//     db.query('SELECT * FROM questions', 
//         function (err, results, fields) {
//             if (err) throw err;
//             else console.log('Selected ' + results.length + ' row(s).');
//             for (i = 0; i < results.length; i++) {
//                 console.log('Row: ' + JSON.stringify(results[i]));
//             }
//             console.log('Done.');
//         })
//     db.end(
//         function (err) { 
//             if (err) throw err;
//             else  console.log('Closing connection.') 
//     });
// };

// get single data  :

app.get('/question/:id', (req, res) => {
    // (whatever after question/:x req.params.x will log what comes after question/:
    console.log(`Get data by ID : ${req.params.id}`)
    let qrId = req.params.id
    let qr = `SELECT * FROM questions where qid=${qrId}`
    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'error');
        }
        if (result.length > 0) {
            res.send({
                message: "The requested data",
                data: result
            })
        }
        else {
            res.send({
                message: "The requested data was not found"
            })
        }
    })

})



app.listen(3000, () => {
    console.log("Server is running on 3000 port")
})

