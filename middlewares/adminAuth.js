    function adminAuth(req, res, next){
        if(req.session.user != undefined){
            next()
        }else{
           res.redirect("/adm/user/login")
        }
    }
    
   
module.exports = adminAuth