import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"


const generateAccessTokenandRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validationBeforeSave:false})

        return {refreshToken,accessToken};

    } catch (error) {
        throw new apiError(500,"something went wrong while AccessToken and refreshToken")
    }
}

            // what i do for registering
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
    console.log("Received body:", req.body);

    if(
        [username,email,password].some((field)=>
        field?.trim()==="")
    ){
        throw new apiError(400,"All fields are required")
    }

    const ExistedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(ExistedUser){
        throw new apiError(409,"User already existed") 
    }

    const user = await User.create(
        {
            username:username.toLowerCase(),
            email,
            password
        }
    )
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new apiError(500,"something went wrong while Registering the user.....! ")
    }     
    return res.status(201).json(
        new apiResponse(200,createdUser,"✅Registerd successfuly")
    ) 
})

export {registerUser}