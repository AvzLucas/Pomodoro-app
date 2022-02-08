// set up the server
const express = require('express')
const app = express()

app.get('/', (req,res)=>{
    res.sendFile('C:/Pomodoro/public/views/index.html')
})
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(express.static('public'))

module.exports = app