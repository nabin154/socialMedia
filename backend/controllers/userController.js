const User = require("../models/userModel");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const searchUsers = async (req, res) => {
  const username = req.query.username;
  try {
    const keyword = username ? {
      $or: [
        { firstName: { $regex: username, $options: "i" } },
        { email: { $regex: username, $options: "i" } },
      ]
    } : {}
    const users = await User.find({
      $and: [keyword, { email: { $ne: req.user.email } }],
    });
    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });

  }
}


const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getUserFriendRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friendRequest.received.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json({ sent: user.friendRequest.sent, received: formattedFriends });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id != friendId);
      friend.friends = friend.friends.filter((id) => id != id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    if (user.friendRequest.received.includes(friendId) && (friend.friendRequest.sent.includes(id))) {
      user.friendRequest.received = user.friendRequest.received.filter((id) => id != friendId);
      friend.friendRequest.sent = friend.friendRequest.sent.filter((id) => id != id);
    }
    await user.save();
    await friend.save();
    console.log(user.friendRequest);
    console.log(friend.friendRequest);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const addRemoveFriendRequests = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);


    if (friend.friendRequest.received.includes(id) || user.friendRequest.received.includes(friendId)) {
      friend.friendRequest.received = friend.friendRequest.received.filter((id) => id != id);
      friend.friendRequest.sent = friend.friendRequest.sent.filter((id) => id != id);
      user.friendRequest.sent = user.friendRequest.sent.filter((id) => id != friendId);
      user.friendRequest.received = user.friendRequest.received.filter((id) => id != friendId);
    } else {
      friend.friendRequest.received.push(id);
      user.friendRequest.sent.push(friendId);
    }
    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friendRequest.received.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res
      .status(200)
      .json({ sent: user.friendRequest.sent, received: formattedFriends });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getUserFriends,
  searchUsers,
  getUserFriendRequests,
  addRemoveFriend,
  getUser,
  addRemoveFriendRequests,
};