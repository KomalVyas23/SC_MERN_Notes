const User = require("../models/userModel");

const checkInput = function(req, res, next){
    const userDetails = req.body;
    const isEmpty = Object.keys(userDetails).length === 0;
    if(isEmpty){
        res.status(400).json({
            status: 400,
            message: "Body cannot be empty",
        });
    }else{
        next();
    }
};

/** Handler */
//Routes Handler
async function getUser (req, res){
    try{
      const userData = await User.find();
      if(userData === 0){
        throw new error("No user found")
      }else{
        res.status(200).json({
            message: userData,
        })
      }
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

async function createUser(req, res) {
    try{
      const user = await User.create(userDetails);
      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    }catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

async function getUserById(req, res){
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      res.json({
        status: 200,
        message: "User found",
        data: user,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  }

async function updateUserById(req, res){
    try{
        const { id } = req.params;
        const updatedUserData = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {new: true})
        if(!updatedUser){
            throw new Error("User not found");
        }else{
            res.status(200).json({
                status: 200,
                message: "User updated successfully",
                data: updatedUser,
            })
        }
    }catch(err){
        return res.status(500).json({
            message: "err.message",
            status: 500
        })
    }
}

async function deleteUserById(req, res){
    try{
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            throw new Error("User not found");
        }else{
            res.status(200).json({
                status: 200,
                message: "User deleted successfully",
                data: deletedUser,
            })
        }
    }catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    } 
}

module.exports = {
    getUser,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    checkInput
};