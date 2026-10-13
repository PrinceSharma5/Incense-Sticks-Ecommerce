const mongoose=require('mongoose');

const dbToConnect=async()=>{
    try {
        
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database Connected');
    } catch (error) {
        console.error("Database connection failed:",error.message)
        throw error
    }
}

module.exports=dbToConnect;
