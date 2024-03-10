import UserModel from "../model/userModel.js";

export async function verifyUser(req,res,next){
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        //check the user existence
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({error: "Cannot find user!"});
        next();
    } catch (error) {
        return res.status(404).send({error: "Authentication error"});
    }
}