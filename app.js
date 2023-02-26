const express=require('express');
const app=express();
const session=require('express-session');//ספרייה המאפשרת עבודה עם סשנים בסביבת אקספרס
const MongoStore=require('connect-mongo')
const port=process.env.PORT || 5050;
const mongoConnStr=process.env.MONGO_STR || 'mongodb+srv://simon:yaron123@cluster0.aas0e.mongodb.net/session?retryWrites=true&w=majority'

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const maxAge=1000*60*10;//משך החיים של הסשן עשר דקות
app.use(session({
secret:'simonzilber7',
resave:false,
saveUninitialized:true,
cookie:{maxAge:maxAge,httpOnly:false},
store:MongoStore.create({
    mongoUrl:mongoConnStr
})
}));


// הגדרת נקודת קצה שמאפשרת גישה רק למשתשמשים רושמים שעברו תהליך הזדהות
app.get('/manage',(req,res)=>{
    if(req.session.user)
    {
        return res.status(200).json({Msg:`Welcome ${req.session.user.fullName}`});
    }
    else
    {
        return res.status(407).json({Msg:'You are Not Authorized for this resources'});
    }
});


//נקודת קצה לביצוע לוגין למערכת
//בידה והלוגין עבר בהצלחה, נוצר משתנה מסוג סשן בשם יוצר
//ןבתוכו שמורים פרטים שימושיים אודות המשתמש
app.post('/login',(req,res)=>{
    const {user,pass} = req.body;
    if(user == 'simon' && pass=='123')
    {
        //יצרנו משתנה מסוג סשן שמכיל אובייקט עם פרטי 
        const userData={fullName:'simon zilber',uid:22,user};
        req.session.user=userData;
        return res.status(200).json(userData);
    }
    else{
        return res.status(407).json({Msg:'User / password are wrong'});
    }    
});







app.listen(port,()=>{
    console.log('Server is Up');
});