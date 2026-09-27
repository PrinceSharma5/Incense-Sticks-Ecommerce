const mongoose=require('mongoose');

const dbToConnect=async()=>{
    try {
        
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database Connected');
    } catch (error) {
        
        console.log(error);
        
    }
}

module.exports=dbToConnect;