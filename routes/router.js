const express = require("express")
const router = express.Router()
const Category = require("../models/Category")
const Article = require("../models/Article")
const adminRouter = require("./adminRouter")
router.get("/", (req, res)=>{
    Article.findAll({raw: true, order: [
        [ 'id','DESC']
     ],
     limit: 4
    }).then(articles=>{
        Category.findAll().then(categories => {

            res.render("index", {categories, articles})
        })
    })
})
router.get("/read/:slug",(req,res)=>{
    let slug = req.params.slug
    Category.findAll().then(categories=>{
        Article.findOne({where: {slug: slug}}).then(article=>{
            if(article != undefined){
                res.render("read", {categories, article})

            }else{res.redirect("/")}
        }).catch(error =>{
            res.redirect("/")
        })    
    })
})
router.get("/articles/:num",(req,res)=>{
    let page = req.params.num
    let limitNum = 2;
    let offset = 0
    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page)-1) * limitNum
    }
    Article.findAndCountAll({
        limit: limitNum,
        offset: offset,
        order: [
            [ 'id','DESC']
         ]
    }).then(articles=>{
        let next;
        if(offset + limitNum >= articles.count){
            next = false
        } else { next = true  }
        
        let result = { 
            articles: articles, 
            next: next,
            nextPage: parseInt(page) + 1
        }
        Category.findAll().then(categories => {
            res.render("page", {categories, result})
        })
    })
})
router.get("/category/:category/:num",(req,res)=>{
    let category = req.params.category
    let page = req.params.num
    let limitNum = 2;
    let offset = 0
    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page)-1) * limitNum
    }
// ------------ banco -------------
    Category.findOne({where: {slug: category}}).then(category=>{
        Article.findAndCountAll({
            limit: limitNum,
            offset: offset,
            order: [
                [ 'id','DESC']
            ],
            where: {categoryId: category.id}
        }).then(articles=>{
            let next;
            if(offset + limitNum >= articles.count){
                next = false
            } else { next = true  }
            
            let result = { 
                articles: articles, 
                next: next,
                nextPage: parseInt(page) + 1,
                category: category
            }
            Category.findAll().then(categories => {
                res.render("category", {categories, result})
            })
        })
        // --------------------
    })

})

router.use("/adm", adminRouter)


module.exports = router