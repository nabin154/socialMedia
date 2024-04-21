import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Friend from "../../components/Friend";
import axiosInstance from "../../refreshToken/Token";


const SearchUsers = () => {
  const theme = useTheme();

  const [showMessageModal, setShowMessageModal] = useState(false);
 const [searchValue, setSearchValue] = useState();
 const [searchedUsers, setSearchedUsers] = useState();
  const background = theme.palette.background.default;
 
 
 
  const handleSearch = async (e) => {
    let  searchTimeout;
    setSearchValue(e.target.value);
    console.log(searchValue);
    
    clearTimeout(searchTimeout);
    
  searchTimeout = setTimeout(async () => {
        try {
            const { data } = await axiosInstance.get(`/user?username = ${searchValue}`);
            setSearchedUsers(data);
            console.log(data);
        } catch (error) {
            console.log('Error searching for users:', error);
        } finally {
            setShowMessageModal(!showMessageModal);
        }
    }, 1500);

};

   
  
  const handleClose =() =>{
    setShowMessageModal(!showMessageModal);
    setSearchValue('');
  }

  return (
    <>
      <InputBase
        placeholder="Search..."
        onChange={handleSearch}
        value={searchValue}
      />
      <IconButton onClick={() => setShowMessageModal(!showMessageModal)}>
        <Search />
      </IconButton>
      {showMessageModal && (
        <Box
          maxWidth={"300px"}
          borderRadius={"10px"}
          padding={3}
          color={"white"}
          zIndex={1}
          sx={{
            position: "absolute",
            left: "24%",
            top: "10%",
            backgroundColor: { background },
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="1.5rem"
            color={"lightblue"}
          >
            {searchedUsers &&
              searchedUsers.map((friend) => (
                <Friend
                  key={friend._id}
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  userPicturePath={friend.picturePath}
                  postId={true}
                />
              ))}
          </Box>
          <Button
            onClick={handleClose}
            sx={{
              marginLeft: "40%",
              marginTop: "10px",
              backgroundColor: "#00D5FA",
              color: "white",
              borderRadius: "8px",
              height: "22px",
            }}
          >
            close
          </Button>
        </Box>
      )}
    </>
  );
};

export default SearchUsers;
