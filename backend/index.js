const express = require("express")
const cors = require("cors")
const io = require("socket.io")()

io.on("connection", client => {
  startGame(client)
})

io.listen(3000,{
  cors:{origin:"*"}
})


function startGame(client){
  client.emit("init", { data: Math.random() } )

  // setInterval(() => {
  //   client.emit("init", { data: Math.random() } )
  // }, 1000/120);
}

// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(cors())

// app.get("/", (req,res) => {
//   res.json({working: true})
// })

// const port = 3000

// app.listen(port,() => console.log(`Server running at http://localhost:${port}`))