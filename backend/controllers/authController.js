const User = require("../models/userModel");


const registerUser = async(req,res) =>{

    const { firstName, lastName, location, occupation, email, password,picturePath, friends} = req.body;
    try{
        const newUser = new User({firstName, lastName, location, occupation, email, password,picturePath, friends,
        viewedProfile : Math.floor(Math.random()*10000),
    impressions : Math.floor(Math.random()*10000)});
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    }
    catch(err)
    {
        res.status(500).json({msg: err.messsage});
    }


}

const  loginUser = async (req, res) =>{
    const { email , password} = req.body;
    try{

        const user  = await User.findOne({email});
        if (!user)
        {
           return res.status(404).json({msg:"user doesnot exists"});
        }
      
            const verified = await user.comparePassword(password);
        if(verified)
        {
            return res.status(200).json({
             _id: user._id,
             firstName : user.firstName, 
             lastName : user.lastName,
              location : user.location, 
              occupation : user.occupation, 
              email : user.email,
               picturePath : user.picturePath,
               friends  : user.friends,
        viewedProfile : user.viewedProfile,
    impressions : user.impressions,
    token : user.generateToken(),


            });
        }
        else{
             return res.status(400).json({ msg: "invalid credentials" });
        }
    }
    catch(err)
    {
        
       return res.status(504).json({ msg: err.message });

    }
}

module.exports = { loginUser, registerUser };