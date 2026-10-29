import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser=asyncHandler(async (req,res)=>{
    
    //Get user detail from frontend
    //validate-not empty
    //check if user already exist:username,email
    //check for images, check from avatar
    //Upload them to cloudinary,avatar
    //create user object,create entry in db
    //Remone password and refresh token
    //check for user creation
    //return response

    const {email,username,fullName,password}=req.body
        console.log("email:",email);

    if (
        [fullName,email,username,password].some((field)=>
        field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields are required")
    }


    const existedUser=User.findone({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username is already exist")
    }


    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImagePath[0]?.path;

    if(!avatarLoaclPath){
        throw new ApiError(400,"Avatar is required")
    }


    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coveriImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar is required") 
    }


    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select(
       "-password -refreshToken" 
    )
    if(!createdUser){
        throw new ApiError(500,"Somathing went wrong while registring the user")
    }

    return res.status(200).json(
        new ApiResponse(201,userCreated,"User registered successfully")
    )
})

export {registerUser}