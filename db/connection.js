const mongoose = require('mongoose');

const URI = "mongodb+srv://dbUser:dbUser@cluster0.nr5pd.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () => {
    await mongoose.connect(URI, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true
    });
}

module.exports = connectDB;