const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const adminAuth = require("../../middlewares/adminAuth")

router.get("/", adminAuth,(req, res)=>{
    res.send("rota de usuario")
})
//Criar usuario 
router.get("/new-user", adminAuth,(req,res)=>{
    res.render("admin/newuser")
})
router.post("/new-user", adminAuth,(req, res)=>{
    let email = req.body.email
    let password = req.body.password

    User.findOne({where:{email: email}}).then(user=>{
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)
            User.create({email: email, password: hash}).then(()=>{
                res.redirect("/adm")
            }).catch(error=>{
                res.redirect("/user/new-user")
            })
        } else{
            let data = {}
            data.error = "Email já cadastrado..."
            res.render("user/create", {data})
        }
    })
})

//Fazer login
router.get("/login", (req, res)=>{
    let data = {error: false}
    res.render("admin/loginuser",{data})
})
router.post("/login", (req, res)=>{
    let email = req.body.email
    let password = req.body.password
    User.findOne({where:{email: email}}).then(user=>{
        if(user == undefined){ //se não existir vai renderizar login e mandar erro...
            let data = {error: "Email ou senha incorretos!"}
            res.render("admin/loginuser", {data})
        } else{ //se tiver dado certo...
            var correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/adm")
            }else{
                let data = {error: "Email ou senha incorretos!"}
                res.render("admin/loginuser", {data})
            }
        }
    })
})

module.exports = router