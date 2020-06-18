const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const expressHandleBars = require("express-handlebars")
const todoRoutes = require('./routes/todos')

const PORT = config.get("port") || 8000
const app = express()
const hbs = expressHandleBars.create({
    defaultLayout:'main',
    extname:'hbs'
})

app.engine('hbs',hbs.engine)
app.set('view engine','hbs')
app.set('views','views')

app.use("/api/auth",require("./routes/auth.routes"))



async function start(){
    try{
        await mongoose.connect(config.get("mongoURI"),{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true
        })
        
    app.listen(PORT, ()=>{
        console.log(`Server has been started on port ${PORT}.......`)
        })
    }catch(e){
        console.log("Server Error!",e.message)
        process.exit(1)
    }
}

start()