export const getSender= (chat , loggedInUser)=>{
 
return chat.users[0]._id == loggedInUser._id ? chat.users[1] : chat.users[0];

}