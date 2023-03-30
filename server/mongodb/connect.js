import mongoose from "mongoose";

const connectDB=(url)=>{
    mongoose.set('strictQuery',true);

    mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log('mongodb connected'))
    .catch((err)=>{
        console.error('failed to connect with mongoDB')
        console.error(err)
    });
}

export default connectDB;