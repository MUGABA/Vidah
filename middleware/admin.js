module.exports= admin = (req,res,next )=>{
	if(!req.user.isAdmin)
		return res.status(403)
			.send({message:"Access denied,you have no permisions for this task"});

	next()

}