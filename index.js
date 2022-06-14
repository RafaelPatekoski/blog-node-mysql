const express = require("express")
const app = express()
const router = require("./routes/router")
// ==============  PADRÃO BLOG  ====================
const connection = require("./database/database")
const bodyParser = require("body-parser")
const session = require("express-session")

app.use(session({
    secret: "patekoski",
    cookie: { maxAge: 300000 },
    resave: true,
    saveUninitialized: true
}))
app.set("view engine", "ejs")

//STARTIC
app.use(express.static("public"))
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Database 
connection.authenticate().then(()=>{
    console.log("Conexão feita com sucesso")
}).catch((error)=>{
    console.log(error)
})
// ==============  PADRÃO  ====================
app.use("/", router)
const Article = require("./models/Article")
Article
app.listen(3000,()=>{
    console.log("servidor no ar...")
})