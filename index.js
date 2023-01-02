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
    multipleStatements: true
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

// get all data (questions + options) : 
app.get('/questions', (req, res) => {
    console.log("Get all questions")
    // let qr = 'SELECT * FROM questions'
    let qr = 'SELECT * FROM questions JOIN quiz_options ON questions.qid=quiz_options.qid'
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


// get single data (question + options) with req parameter :
app.get('/question/:id', (req, res) => {
    console.log(`Get data by ID : ${req.params.id}`)
    let qrId = req.params.id
    // let qr = `SELECT * FROM questions where qid=${qrId} AND SELECT * FROM options where qid=${qrId}`
    let qr = `SELECT * FROM questions JOIN quiz_options ON questions.qid=quiz_options.qid WHERE questions.qid=${qrId}`


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

// post question & options in questions + quiz_options :

app.post('/question', (req, res) => {
    // console.log("Post data success")
    // console.log(req.body);
    let questions = req.body.questions
    // let qenabled = req.body.quetions.is_enabled
    let options = req.body.options
    // let oenabled = req.body.optionsis_enabled
    // qr = `INSERT INTO questions (question,is_enabled) VALUES ('${question}', ${enabled})`
    console.log(options[0].option);
    qr = `
    INSERT INTO questions (qid,question,is_enabled) VALUES (NULL,'${questions.question}',${questions.is_enabled});`
    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'error')
            throw err;
            // console.log(req.body.questions)
            // console.log(req.body.options)
            // console.log(result.insertId);

        }
        console.log(result.insertId);
        let lastinsertId=result.insertId
        let arrayValues = []
        let valueToInsert=""
       
        for (i in options){
            valueToInsert = [result.insertId, options[i].option, options[i].enabled]
            arrayValues.push(valueToInsert)
            // renvoie juste la dernière, ça va pas
            // arrayValues=[...arrayValues, result.insertId, options[i].option, options[i].enabled]
        }
        // essai en dur OK :
        // let values =[[lastinsertId,'dfdfdsfdsfsdfdsf',1],[lastinsertId,'ooooooooooooooooooo',1]], auquel cas, faut quand même passer values en paramètre de query avec []!!!!!!!!!!!!!!!
        // console.log('blabla', values); OK
        console.log("array values avant requête", arrayValues);
        let qrOptions="INSERT INTO `quiz_options`(`qid`,`option`,`is_enabled`) VALUES ?;"
    
        db.query(qrOptions,[arrayValues],(errOptions, resultOptions)=>{
            if(errOptions){
                console.log("Error on options insert", errOptions)
                throw errOptions; 
            }
            res.send({
            message: "Post data Options & related Question",
            data:{...resultOptions, result}
        })

        console.log("data sent", resultOptions);
        console.log("data sent", result);
        
        })
        // res.send({
        //     message: "Post data success",
        //     data: result

        // })
    })

})


app.put('/question/:id', (req, res) => {
    console.log("Put data succcess");
    console.log(req.params.id);
    let qrId = req.params.id
    let question = req.body.question
    let enabled = req.body.is_enabled
    qr = `UPDATE questions SET question='${question}', is_enabled=${enabled} where qid=${qrId} `
    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'error')
            res.send({
                message: "Update data failed" + err,
            })
        }
        else {
            res.send({
                message: "Update data success",
                data: result.affectedRows
            })
        }
    })

})

// delete data :
app.delete('/question/:id', (req, res) => {
    // console.log('delete success');
    // console.log(req.params.id);
    qrId = req.params.id
    qr = `DELETE from questions where qid=${qrId}`
    db.query(qr, (err, result) => {
        if (err) {
            console.log(err);
            res.send({
                message: `Something is wrong. Request can not be executed on id = ${qrId}`
            })
        }
        else {
            res.send({
                message: 'data has been deleted',
                data: result

            })
        }
    })
})

app.listen(3000, () => {
    console.log("Server is running on 3000 port")
})

