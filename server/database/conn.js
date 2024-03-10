import mongoose from "mongoose";

async function connect(){
    const mongo_uri = process.env.MONGO_URI;

    mongoose.connect(mongo_uri)
    .then(()=>console.log("Database connection successful!"))
    .catch((err)=>console.log(err));
}

export default connect;