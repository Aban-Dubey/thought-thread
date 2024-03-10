import { Router } from "express";
import { register, login, getUser, generateOtp, verifyOtp, createResetSession, updateUser, resetPassword } from "../controllers/loginSignUpControllers.js";
import { registerMail } from "../controllers/mailer.js";
import auth from "../middleware/auth.js";
import { verifyUser } from "../middleware/verifyUser.js";
import { localVariables } from "../middleware/localVariables.js";

const router = Router();

//POST routes
router.post("/register",register);
router.post("/registerMail",registerMail);
router.post("/authenticate",verifyUser,(req,res)=>res.end());
router.post("/login",verifyUser,login);

//GET routes
router.get("/user/:username",getUser);
router.get("/generateOTP",verifyUser,localVariables,generateOtp);
router.get("/verifyOTP",verifyUser, verifyOtp);
router.get("/createResetSession",createResetSession);

//PUT routes
router.put("/updateUser",auth,updateUser);
router.put("/resetPassword",verifyUser,resetPassword);

export default router;