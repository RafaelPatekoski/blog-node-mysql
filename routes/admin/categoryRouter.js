const express = require("express")
const router = express.Router()
const Category = require("../../models/Category")
const Article = require("../../models/Article")
const slugify = require("slugify")

router.get("/", (req, res)=>{
    Category.findAll({order: [['id','DESC']]}).then(categories=>{
        let data = {categories: categories}
        res.render("admin/category",{data})
    })
    
})

router.get("/new", (req, res)=>{
    res.render("admin/category/new")
})

router.post("/new",(req, res)=>{
    let title = req.body.title
    Category.create({
        title: title,
        slug: slugify(title)
    }).then(()=>{
        res.redirect("/adm/category")
    })
})

/router.get("/edit/:id", (req,res)=>{
    let id = req.params.id
    if(isNaN(id)){
        res.redirect("/adm/category")
    }
    Category.findByPk(id).then(category=>{
        if(category != undefined){
            let data = {category: category}
            res.render("admin/category/edit", {data})
        }else{
            res.redirect("category")
        }
    })
})
router.post("/edit", (req,res)=>{
    let id = req.body.id
    let title = req.body.title
    console.log(title)
    console.log('ID: ',id)
    Category.update({
        title: title,
        slug: slugify(title)
    },{where: {id: id}}).then(()=>{
        res.redirect("/adm/category")
    })
})

router.delete("/delete/:id", (req,res)=>{
    console.log("deleteeee")
    let id = req.params.id
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({where: {categoryId: id}}).then(()=>{
                Category.destroy({where: {id: id}}).then(()=>{
                    res.send(`A category id:${id} foi deletada...`)
                    })
            })

        }else{
            res.redirect("/adm/category")
        }
    }else{
        res.redirect("/adm/category")
    }
})


module.exports = router