const mongoose = require('mongoose');

const connectionString = "mongodb+srv://shriNiwash:Mriphone12345@cluster0.waox8.mongodb.net/MERN_SHRI?retryWrites=true&w=majority";

mongoose.connect(connectionString).then(() => console.log("connection established")).catch((err) => console.log(err));