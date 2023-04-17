const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('./model/dbConnection');
const bodyparser = require('body-parser');
const dated = require('@theinternetfolks/snowflake');
const roleRouter = require('./Router/roleRouter');
const userRouter = require('./Router/userRoute');
const communityRouter = require('./Router/communityRouter');
const memberRouter = require('./Router/memberRouter');


app.use(bodyparser.json());
app.use(express.urlencoded({extended:false}));

app.use('/v1',roleRouter)
app.use('/v1/auth',userRouter);
app.use('/v1',communityRouter);
app.use('/v1',memberRouter);


app.get("/",(req,res)=>{
    res.send('hello world');
})



app.listen(PORT,()=>console.log(`The server is running on PORT ${PORT}`));


