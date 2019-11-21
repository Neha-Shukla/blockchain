const express = require('express')
const app = express();
const bodyparser=require('body-parser');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
 
app.get('/blockchain', function (req, res) {
  
});
app.post('/transaction', function (req, res) {
  console.log(req.body);
  res.send(`the amount is ${req.body.amount}`);
});
app.get('/mine', function (req, res) {
  
});
app.listen(3000,function()
{
    console.log("running on port 3000...");
});