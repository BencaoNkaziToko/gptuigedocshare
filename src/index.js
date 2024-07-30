const express = require("express")
const session = require("express-session")
const app = express()
const bodyParser = require("body-parser")

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "jkhfjksdhfsdfs",
    resave: true,
    saveUninitialized: true
}))

const connection = require('./database/db')
connection.connect(function(error){
    if(!!error){ console.log("Warning: "+error)}
    else console.log("****  Database Connected successfuly  ****")
})



//USANDO ROTAS DO SYSTEM
app.use('/', require('./routes/dash'))
app.get('*', (req, res)=>{
    res.render('_404')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando en http://localhost:${PORT}`);
});

