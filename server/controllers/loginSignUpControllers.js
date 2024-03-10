import UserModel from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import bodyParser from 'body-parser';

export const register = async (req, res, next) => {
    try {
      // Parse JSON and url-encoded bodies with increased payload size limit
      bodyParser.json({ limit: '50mb' })(req, res, async (error) => {
        if (error) {
          return res.status(413).send({ error: 'Request entity too large' });
        }
  
        const { username, password, profile, email } = req.body;
  
        // Check existing username
        let existingUser;
        try {
          existingUser = await UserModel.findOne({ username });
        } catch (error) {
          return res.status(500).send({ error });
        }
  
        // Check existing email
        let existingEmail;
        try {
          existingEmail = await UserModel.findOne({ email });
        } catch (error) {
          return res.status(500).send({ error });
        }
  
        if (!existingUser && !existingEmail) {
          const hashedPassword = bcrypt.hashSync(password);
          const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email,
          });
  
          try {
            await user.save();
          } catch (error) {
            return res.status(500).send({ error: 'Cannot register, invalid value in fields!' });
          }
  
          return res.status(201).send({ msg: 'User registered successfully!' });
        } else {
          return res.status(500).send({ error: 'Please use a unique username and email!' });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal server error' });
    }
};

export const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        const passwordCheck = bcrypt.compareSync(password, user.password);
        
        if (passwordCheck) {
            const token = jwt.sign({
                userId: user._id,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 * 1000 });

            return res.status(200).send({
                msg: "Login Successful!",
                userId: user._id, // Include user ID in the response
                username: user.username,
                token
            });
        } else {
            res.status(401).send({ error: "Password does not match!" });
        }
    } catch (error) {
        res.status(500).send({ error: "Cannot log in!" });
    }
};


// export const login = async(req,res,next)=>{
//     const { username, password } = req.body;

//     try {
//         const user = await UserModel.findOne({username});
//         const passwordCheck = bcrypt.compareSync(password, user.password);
//         if(passwordCheck){
//             const token = jwt.sign({
//                 userId: user._id,
//                 username: user.username
//             },process.env.JWT_SECRET, {expiresIn: 24 * 60 * 60 * 1000})
            
//             return res.status(200).send({
//                 msg: "Login Successful!",
//                 username: user.username,
//                 token
//             })
//         } else {
//             res.status(401).send({error: "Password does not match!"});
//         }
//     } catch (error) {
//         res.status(500).send({error: "Cannot log in!"});
//     }
// };

export const getUser = async(req,res,next)=>{
    const { username } = req.params;

    try {
        let user = await UserModel.findOne({username});
        if(!user){
            return res.status(404).send({error: "Cannot find user with given username."});
        }
        //remove password from the user to be sent
        //mongoose returns unnecessary data with object so convert it into json
        const  {password, ...rest} = Object.assign({}, user.toJSON());

        return res.status(201).send(rest);
    } catch (error) {
        return res.status(500).send({error: "Cannot find the user."})
    }
    
};

export const generateOtp = async(req,res,next)=>{
    req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    res.status(201).send({code: req.app.locals.OTP});
};

export const verifyOtp = async(req,res,next)=>{
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; //start the session for reset password
        return res.status(201).send({msg: "Verified Successfully!"});
    }
    return res.status(400).send({error: "Invalid OTP"});
};

export const createResetSession = async(req,res,next)=>{
    if(req.app.locals.resetSession) {
        return res.status(201).send({flag: req.app.locals.resetSession});
    }
    return res.status(440).send({error: "Session expired!"});
};

export const updateUser = async(req,res,next)=>{
    try {
        const newUserData = {
            username: req.body.username,
            profile: req.body.profile,
            email: req.body.email,
            firstName: req.body.firstName || '',
            lastName: req.body.lastName || '',
            mobile: req.body.mobile || '',
            address: req.body.address || ''
        };
    
        const { userId } = req.user;
        var user;
        try {
                user = await UserModel.findByIdAndUpdate(userId, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });
        } catch (error) {
            return res.status(500).send({error});
        }
    
        if(!user) {
            return res.status(404).send({error: "User not found with the given _id"});
        }
    
        res.status(200).send({message: "updated successfully"});
    } catch (error) {
        res.status(500).send({error: "Cannot update user! Either duplicate field values entered or authentication unsuccessful."})
    }
    
};

export const resetPassword = async(req,res,next)=>{
    // Let this route be accessed only when the resetSession is exists after generating and verifying OTP
    if(!req.app.locals.resetSession){
        return res.status(400).send({error: "Session expired!"});
    }

    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username })
        if(user){
            const hashedPassword = bcrypt.hashSync(password);
            try {
                const updateUser = await UserModel.updateOne({username: user.username}, {password: hashedPassword});
                req.app.locals.resetSession = false; //reset session once the password is updated successfully
                res.status(201).send({msg: "Password reset successfully"});
            } catch (error) {
            res.status(500).send({error: "Cannot update user password!"});
                
            }
        } else {
            return res.status(404).send({error: "User not found!"});
        }
    } catch (error) {
        res.status(500).send({error: "Cannot reset password!"});
    }
};