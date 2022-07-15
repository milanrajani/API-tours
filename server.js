const app = require('./app')
const mongoose  = require('mongoose');
 

const DB = 'mongodb+srv://Milan:milan123@cluster0.o9sqfce.mongodb.net/Authentication?retryWrites=true&w=majority'

mongoose.connect(DB, { useNewUrlParser: true })
    .then(() => {
        console.log(`connection successfull`);
    }).catch((err) => console.log(`Error occur while connecting to Database`))


 


app.listen(3000,()=>{
    console.log("App is running ");
}) 
 