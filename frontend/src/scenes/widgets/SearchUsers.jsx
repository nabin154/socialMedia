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
import ChatIcon from "@mui/icons-material/Chat";
import { Search } from "@mui/icons-material";
import {useSelector} from 'react-redux'
import axios from 'axios'
import Friend from "../../components/Friend";
const SearchUsers = () => {
  const [showMessageModal, setShowMessageModal] = useState(false);
 const [searchValue, setSearchValue] = useState();
 const [searchedUsers, setSearchedUsers] = useState();
  const token = useSelector((state) => state.token);

 
  const handleSearch = async (e) => {
    setSearchValue(e.target.value);
    setTimeout(async () => {
        try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/user?username=${searchValue}`,
        config
      );
      setSearchedUsers(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } 
      setShowMessageModal(!showMessageModal);

    }, 1500);
    
   
  };

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
            backgroundColor: "white",
          }}
        >
          <Box display="flex" flexDirection="column" gap="1.5rem" color={'lightblue'}>
            {searchedUsers &&
              searchedUsers.map((friend) => (
                <Friend
                  key={friend._id}
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  userPicturePath={friend.picturePath}
                  postId={""}
                />
              ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SearchUsers;
