const express = require("express")
const router = express.Router()
const Article = require("../../models/Article")
const Category = require("../../models/Category")
const slugify = require("slugify")
router.get("/",(req,res)=>{
    Article.findAll({include: [{model: Category}], order: [['id','DESC']]}).then(articles => {
        let data = {articles: articles}
        res.render("admin/article", {data})
    })
})
//Criar artigo
router.get("/new", (req, res)=>{
    Category.findAll().then(categories=>{
        let data = {categories: categories}
        res.render("admin/article/new", {data})
    })  
})
router.post("/new", (req, res)=>{
    let title = req.body.title
    let article = req.body.article
    let category = req.body.category
    
    Article.create({
        title: title,
        slug: slugify(title),
        body: article,
        categoryId: category,
    }).then(()=>{
        res.redirect("/adm/article")
    })
})
// Editar
router.get("/edit/:id",(req, res)=>{
    let id = req.params.id
    if(isNaN(id)){
        res.redirect("/adm/article")
    }
    Category.findAll().then(categories=>{
        Article.findByPk(id).then(article=>{
            if(article != undefined){
                data = {article: article, categories: categories}
                res.render("admin/article/edit", {data})
            }else{
                res.redirect("/adm/article")
            }
        })
    })
})
router.post("/edit",(req,res)=>{
    let id = req.body.id
    let title = req.body.title
    let body = req.body.article
    let categoryId = req.body.category
    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categoryId
    },{where: {id: id}}).then(()=>{
        res.redirect("/adm/article")
    })
})
//Deletar
router.delete("/delete/:id",(req,res)=>{
    console.log("deleteeeeeeee")
    let id = req.params.id
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({where: {id: id}}).then(()=>{
            res.send(`O artigo id:${id} foi deletado...`)
            })
        }else{
            res.redirect("/adm/article")
        }
    }else{
        res.redirect("/adm/article")
    }
})

module.exports = router