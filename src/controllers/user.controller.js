import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"


const generateAccessTokenandRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const AccessToken = user.generateAccessToken()
        const RefreshToken = user.generateRefreshToken()

        user.RefreshToken = RefreshToken
        await user.save({validationbeforeSave:false})

        return (RefreshToken,AccessToken)
    } catch (error) {
        throw new ApiError(500,"something went wrong while AccessToken and refreshToken")
    }
}


    // GET USER DETAILS FROM FRONTENT
    // VALIDATION - NOT EMPTY
    // CHECK IF USER ALREADY EXISTS  USERNAME,EMAIL
    // CHECK FOR IMAGES, CHECK FOR AVATAR
    // UPLOAD THEM TO CLOUDINARY, AVATAR
    // CREATE USER OBJECT - CREATE ENTRY IN DB
    // REMOVE PASSWORD AND REFRESH TOKEN FIELD FROM RESPONSE
    // CHECK FOR USER CREATION
    // RETURN RES


const registerUser = asyncHandler(async(req,res)=>{
    
    const {username,email,password} = req.body
    if(
        [username,email,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const ExistedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(ExistedUser){
        throw new ApiError(409,"User already existed")
    }

    const user = await User.create(
        {
            username:username.lowercase(),
            email,
            password
        }
    )
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong while Registering the user.....! ")
    }     
    return res.status(201).json(
        new ApiResponse(200,createdUser,"✅Registerd successfuly")
    ) 
})

export {registerUser}