const mongoose = require('mongoose')
const Recipe = require('./models/recipeModel')
const defaultData = require('./data/defaultData');

const mongoURI = 'mongodb://localhost:27017/recipes'
const connectDB = async()=>{
    try{
        await  mongoose.connect(mongoURI)
        console.log('Connected to MongoDB!')

        await Recipe.insertMany(defaultData)
        console.log("Data was inserted successfully")
        process.exit()


    }catch(e){
        console.error(`MongoDB connection error: ${err}`)
        process.exit(1)
    }
}

connectDB()