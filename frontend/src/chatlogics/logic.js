export const getSender= (chat , loggedInUser)=>{
 
return chat.users[0]._id == loggedInUser._id ? chat.users[1] : chat.users[0];

}

export const isSameSender = (messages ,m , i, user) => {
return (
    i < messages.length - 1 &&
    (messages[i+1].sender._id == m.sender._id || messages[i+1].sender._id== undefined )&& messages[i+1].sender._id != user.id 
);
};