const express = require("express")
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const colors = require("colors");
const bodyparser = require("body-parser");
const { dbConnect } = require("./config/db.js");
const verifyToken = require('./middlewares/protectMiddleware.js');
const { registerUser } = require("./controllers/authController.js");
const { createPost } = require("./controllers/postController.js");
const authRoutes = require("./routes/authRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
const http = require('http');
//Configurations

dotenv.config();
const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyparser.json({ limit: '30mb', extended: 'true' }));
app.use(bodyparser.urlencoded({ limit: '30mb', extended: 'true' }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


//File storage configuration

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

////Routes with file registration

app.post("/auth/register", upload.single("picture"), registerUser);
app.post("/posts", upload.single("picture"), verifyToken, createPost);

/////////Routes

app.use("/auth/", authRoutes);
app.use("/user/", userRoutes);
app.use("/posts", postRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);




const port = process.env.PORT || 5001;

dbConnect().then(() => {
    server.listen(port, () => console.log(`Server is running at port ${port}`.yellow.bold));
}).catch((err) => console.log(err));





const onlineUsers = new Map();
const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log('socket connected');

    socket.on("user setup", (userData) => {
        socket.join(userData._id);
        const id = userData._id;
        onlineUsers.set(id, socket.id);
        // console.log(onlineUsers);
        console.log("user connected", userData._id);
    })

    socket.on("joined room", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

    socket.on("new message", (newMessage) => {
        var chat = newMessage.chatId;
        if (!chat.users) return console.log('users not defined');

        // chat.users.forEach((user) => {
        //     if (user._id == newMessage.sender._id) return;
        const user = (chat.users[0] == newMessage.sender._id)?chat.users[1]:chat.users[0];
        const user1 =onlineUsers.get(user);
        console.log(user);
        console.log(user1);
        socket.in(user1).emit("message received", newMessage);
     
        

       
    });



});

