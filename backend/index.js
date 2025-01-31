const express = require('express');
const app = express(); 
require("dotenv").config();
require('./database/connection')
const authRoute = require('./routes/auth.route')
const teamRoute = require('./routes/team.route')
const fileRoute = require('./routes/file.route')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app); 
const File = require('./models/File');


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST','DELETE','PUT','PATCH'] 
}));

const io = new Server(3001, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  },
});

io.on('connection', socket => {
  console.log('user connected', socket.id)

  socket.on('join-file', (id) => {
    socket.join(id);
    // console.log(`User ${socket.id} joined`);
  });

  socket.on('send-changes', ({id, delta}) => {
    socket.to(id).emit('receive-changes', delta)
  })

  socket.on('code-change', (data) => {
    socket.broadcast.emit('receive-code-change', data)
  })

  socket.on('laguage-change', (data) => {
    socket.broadcast.emit('receive-language-change', data)
  })
})


app.get('/', (req, res)=>{
  res.send("hello")
})
app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/api', teamRoute);
app.use('/api/file', fileRoute)



app.listen(8081, ()=>{
    console.log("server connected at 8081");
})