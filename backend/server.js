const  express =  require("express")
const cors  =  require("cors");
const dotenv=require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const path =  require("path");
const colors = require("colors");
const bodyparser = require("body-parser");
const {fileURLToPath} = require("url");
const {dbConnect} = require("./config/db.js");
const {registerUser } = require("./controllers/authController.js")

//Configurations

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy  : "cross-origin"}));
app.use(bodyparser.json({ limit : '30mb', extended : 'true'}));
app.use(bodyparser.urlencoded({ limit : '30mb', extended : 'true'}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


//File storage configuration

const storage = multer.diskStorage({
    destination : function (req, file , cb) {
        cb(null, "public/assets");
    },
    filename : function (req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

////Routes with file registration

app.post("/auth/register", upload.single("picture", registerUser));
/////////Routes

app.use("/auth/", authRoutes);
app.use("/user/", userRoutes);



const port = process.env.PORT || 5001;

dbConnect().then(()=>{
    app.listen(port, ()=> console.log(`Server is running at port ${port}`.yellow.bold));
}).catch((err)=>  console.log(err));
