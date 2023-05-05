const {MongoClient} = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const database = 'Quiz';
const client = new MongoClient(url);
const express = require('express')
const app = express();
const cors = require('cors')
const multer = require('multer');
const path = require('path')

app.use(cors());

// register API
app.use(express.json())
app.post('/register',async (req,resp)=>{
    console.log(req.body);

    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection('Register');
    let response = await collection.insertOne({name:`${req.body.name}`,mobile:`${req.body.mobile}`,email:`${req.body.email}`,password:`${req.body.password}`,role:`${req.body.role}`});
    resp.send(response);
})

//upload file

const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,resp,cd){
            cd(null,"uploads");
        },
        filename:function (req,resp,cb) {
            cb(null,resp.originalname);
          }
    })
}).single("user_file");


app.post('/upload',upload,(req,resp)=>{
    resp.send(JSON.stringify({send:true}));
})



//end

// login api
app.post('/login', async (req,resp)=>{
    var email = req.body.email;
    var password = req.body.password;

    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection('Register');
    let response = await collection.find({email:email}).toArray();
    response.forEach((item)=>{
       console.log(item);
        if(item.password==password){
            resp.send(JSON.stringify({status:true}));
            console.log("true");
            return;
            
        }
        else{
            resp.send(JSON.stringify({status:false}));
            console.log("false");
            return;
        }
    });
    
})

//end



app.get('/id',async (req,resp)=>{
    var id = Number(req.query.id);
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection('quiz');
    let response = await collection.find({q:id}).toArray();
   response.forEach((item)=>{
        resp.send(JSON.stringify(item));
        console.log(item);
    });
})

app.get('/count',async (_,resp)=>{

    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection('quiz');
    let count = await collection.countDocuments();
    resp.send(JSON.stringify({counting:count}))
    console.log(count);
})


// send notes
const pdfs = path.join(__dirname,'pdfs');
app.use(express.static(pdfs));



app.get('/notes',async (req,resp)=>{
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection('Notes');
    let response = await collection.find().toArray();
    resp.send(response)
})

const upload2 = multer({
    storage:multer.diskStorage({
        destination:function(req,resp,cd){
            cd(null,"pdfs");
        },
        filename:function (req,resp,cb) {
            cb(null,resp.originalname);
          }
    })
}).single("user_file");


app.post('/uploadnotes',upload2,async (req,resp)=>{
    resp.send(JSON.stringify({send:true}));
    console.log(req.body);

    

})


app.post('/uploadnotesdata',async (req,resp)=>{
    console.log(req.body);

    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection('Notes');
    let response = await collection.insertOne({sno:`${req.body.sno}`,name:`${req.body.name}`,link:`${req.body.name}.pdf`});
    resp.send(response);

})



app.listen(4000);