import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
// router.post("/register", (req, res) => {
//   console.log("Route hit");
//   res.json({ message: "Route works!" });
// });


export default router