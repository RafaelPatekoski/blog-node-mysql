const express = require("express")
const adminAuth = require("../middlewares/adminAuth")
const router = express.Router()
const userRouter = require("./admin/userRouter")
const categoryRouter = require("./admin/categoryRouter")
const articleRouter = require("./admin/articleRouter")
router.get("/", adminAuth,(req, res)=>{
    res.render("admin")
})
router.use("/article", adminAuth, articleRouter)
router.use("/category", adminAuth,categoryRouter)
router.use("/user", userRouter)

module.exports = router