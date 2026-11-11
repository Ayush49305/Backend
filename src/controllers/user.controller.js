import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens=async (userId)=>{
    try {
        const user=await User.findById(userId)

        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(501,"Something went wrong")
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    
    //Get user detail from frontend
    //validate-not empty
    //check if user already exist:username,email
    //check for images, check from avatar
    //Upload them to cloudinary,avatar
    //create user object,create entry in db
    //Remove password and refresh token
    //check for user creation
    //return response

    const {email,username,fullName,password}=req.body
        //console.log("email:",email);

    if (
        [fullName,email,username,password].some((field)=>
        field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields are required")
    }


    const existedUser= await User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username is already exist")
    }


    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    //const coverImageLocalPath=req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log("req.files:", req.files);
console.log("req.body:", req.body);

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }


    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar?.url){
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
        new ApiResponse(201,createdUser,"User registered successfully")
    )
})

const loginUser=asyncHandler(async(req,res)=>{
    //req body->data
    //username or email
    //find user
    //check password
    //access and refresh token
    //send cookies
    //return res

    const {email,username,password}=req.body

    if(!username && !email){
        throw new ApiError(400,"Username oor email is required")
    }


    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"user doesn't exist")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password")
    }

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user.id)

    const loggedInUser=await User.findById(user.id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,refreshToken,accessToken
            },
            "User logged In successfully"
        )
    )

})


const logoutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            set$:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})

export {
    registerUser,
    loginUser
}