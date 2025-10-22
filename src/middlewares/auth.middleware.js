import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer","")
    
        if (!Token) {
            throw new ApiError(401,"Unauthorized request")
        }
        
        const decodedtoken = jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET)
    
        const newuser = await user.findById(decodedtoken?._id).select("-password -refreshToken")
    
        if (!newuser) {
            throw new ApiError(401,"Invalid Access Token ")
        }
    
        req.newuser = newuser
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})