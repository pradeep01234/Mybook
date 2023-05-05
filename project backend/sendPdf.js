const express = require('express')
const path = require('path')
const app = express();

const pdfs = path.join(__dirname,'pdfs');

app.use(express.static(pdfs));

app.listen(5000);