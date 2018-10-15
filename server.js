require('dotenv').config()

//require express
var express = require('express');
var app = express();

//require mysql
var mysql = require('mysql');

app.set('views', './template') // specify the views directory
app.set('view engine', 'pug') // register the template engine

app.use(express.static('public'))
var port = process.env.PORT|| 3000;

//create a connection to database
var con = mysql.createConnection({
    host: process.env.SERVER,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.NAME
});

//open connect and check the conect is success
con.connect(function (err) {
    if (err) 
        console.log(err);
    console.log("Connected!!!");
});


app.get('/', function (req, res) {
    var page = parseInt(req.query.page);
    index = page - 1;
    perPage = 20;

    //query databases
    var sql = "SELECT * FROM girl";
    con.query(sql, function (err, results) {
        if (err)
            console.log(err);
        var totalPage = Math.ceil(results.length / 10);
        // check page is greater than totalPage
        if (page > totalPage) {
            res.redirect('/?page='+totalPage);
            return;
        }
        // check page is less than totalPage
        if (page < 1 || !page) {
            res.redirect('/?page=1');
            return;
        }
        res.render('index', {
            items: results.slice(index * perPage, (index + 1) * perPage),
            page: page,
            totalPage: totalPage,
            nextPage: page + 1,
            previousPage: page - 1
        });
    })

})

app.listen(port, function () {
    console.log("listening on port 3000");
})