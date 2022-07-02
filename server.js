const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Knex = require('knex');




const app = express();

const db = Knex({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : process.env.user,
    password : process.env.pass,
    database : 'dashboard'
}
});

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) =>{
    db.select().table('project')
    .then(users=> res.json(users))
})

app.get('/p', (req, res) =>{
    db.select().table('employer')
    .then(users=> res.json(users))
})

app.post('/profile', (req, res) =>{
    const {name,url} = req.body
    db('project')
    .returning('*')
    .insert({project : name, url : url  })
    .then(data=>{
        if(data[0].id){
            db.select().table('project')
            .then(users=> res.json(users))
            .catch(err => res.status(400).send(err))
        }
    })
})

app.post('/dashboard', (req, res)=>{
    const {name, url,position,salary,status,trial,period}=req.body
    db('employer')
    .returning('*')
    .insert({name : name, url : url , position : position, salary : salary, trial : trial,status:status , period : period})
    .then(data=>{
        if(data[0].id){
            db.select().table('employer')
            .then(users=> res.json(users))
            .catch(err => res.status(400).send(err))
        }
    })
    .catch(err=> res.status(400).json('bad request'))
})

app.post('/update', (req, res) =>{
    const {id,name, url,position,salary,status,trial,period}=req.body
    db('employer')
    .returning('*')
    .where({id:id})
    .update({name : name, url : url , position : position, salary : salary, trial : trial,status:status , period : period})
    .then(data=>{
        if(data[0].id){
        db.select().table('employer')
        .then(users=> res.json(users))
        .catch(err => res.status(400).send(err))
        }
    })
    .catch(err=> res.status(400).json('not good enough'))
})

app.post('/delete', (req, res) => {
    const {id} = req.body
    db('employer')
    .where({id:id})
    .del()
    .then(db.select().table('employer')
    .then(users => res.json(users[0]))
    .catch(err => res.status(400).send(err)))
    .catch(err => res.status(400).json('bad request'))
})

app.listen(3007)
