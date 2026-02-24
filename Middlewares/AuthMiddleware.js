
export default  authMiddleware = (req,res,next)=>{
    // check if the token sent by the user is valid or not
    try{
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(500).json({
            message: "Something went wrong in catch block",
            error: err.message
        });
    }
}