const express = require('express');
const bodyParser = require('body-parser');
const { application } = require('express');
var mongoose = require('mongoose');
var router = express.Router()
const app = express();
require("dotenv").config(); 
const port = process.env.PORT||5000;
app.use(bodyParser.urlencoded({extended: true}));
// Set the view engine
app.set('view engine', 'ejs');
// Setting directory Path
app.use(express.static('assets'));
app.use('/:page',express.static('assets'));
app.use('/:page/:page',express.static('assets'));
app.use('/:page/:page/:page',express.static('assets'));
app.use('/:page/:page/:page/:page',express.static('assets'));
const MongoClient = require('mongodb').MongoClient


//Set up default mongoose connection
const url = 'mongodb://127.0.0.1:27017/dynamic'
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const dataSchema = new mongoose.Schema({
  table_name: String,
  user: String,
  rowcount: Number, 
  colcount: Number, 
  column: [{
    type: String
}], 
columntype: [{
  type: String
}], 
row: [{
  type: String
}]
});


// Routes
app.post('/table',function (req, res) {
  var data= req.body; 
  var tablename= req.body.tablename;
  var rowcount= req.body.rowcount; 
  var colcount= req.body.colcount; 
  var column= req.body.column; 
  var columntype= req.body.columntype;
  res.render("table", {data: data,colcount: colcount, rowcount: rowcount, column: column, columntype: columntype, tablename: tablename}) 
  console.log(req.body)
})

app.post('/table_save',function (req, res) {
  var data= req.body; 
  var rowcount= req.body.rowcount; 
  var colcount= req.body.colcount; 
  var column= req.body.column; 
  var columntype= req.body.columntype;
  var row = req.body.row;
  var tablename = req.body.tablename;
  //data saving 

  const Dynamic = mongoose.model('table_data', dataSchema);
  var save_data= JSON.stringify(data);
  const table = new Dynamic({
    table_name: tablename,
    user: 'Madison Hyde',
    name: save_data, 
    rowcount: rowcount, 
    colcount: colcount, 
    column: column, 
    columntype: columntype, 
    row: row
  });
  table.save().then(() => console.log("One entry added"+ data));
  //end
  res.render("table_save", {data: data,colcount: colcount, rowcount: rowcount, column: column, columntype: columntype, row: row, tablename: tablename}) 
  console.log(req.body)
})

app.post('/home', function(req,res){
  var rowcount= req.body.rowcount; 
  var colcount= req.body.colcount;
  var tablename= req.body.tablename;
  res.render("home",{rowcount: rowcount, colcount: colcount, tablename: tablename});
})
app.post('/dashboard', function(req,res){
  res.render("dashboard");
})

app.get('/', function(req,res){
  var itr=0;
  res.render("dashboard",{itr: itr});
})
app.get('/register',function(req,res){
  res.render("register")
})
app.get('/login',function(req,res){
  res.render("login")
})
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })