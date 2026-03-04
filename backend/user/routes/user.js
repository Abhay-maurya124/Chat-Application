import express from 'express'
import { getProfile, login, updateprofile, verifyemail } from '../controller/user.js'
import { isAuth } from '../middleware/isAuthenticated.js'
 
const router = express.Router()

router.post('/login',login)
router.post('/verify',verifyemail)
router.get('/profile',isAuth,getProfile)
router.post('/update',isAuth,updateprofile)

export default router