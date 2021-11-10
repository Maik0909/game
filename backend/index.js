const express = require("express")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get("/", (req,res) => {
  res.json({working: true})
})

const port = 3000

app.listen(port,() => console.log(`Server running at http://localhost:${port}`))