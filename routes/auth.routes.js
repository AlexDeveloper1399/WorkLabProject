const {Router} = require("express")
const router = Router()
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const {check,validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const config = require("config")

// /api/auth/register
router.post('/register',
[
    check('email','Некорректный ').isEmail(),
    check('password','Минимальная длина 6 символов').isLength({min:6})
],
async (req,res)=>{
try{
    const {email,password} = req.body
    const candidate = await User.findOne({email})
    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({
            errors: errors.array(),
            message:"Некорректные данные!"
        })
    }
    if(candidate){
        res.status(400).json({message:'Такой пользователь уже существует'})
    }

const hashedPassword = await bcrypt.hash(password,12)
const user = new User({email, password:hashedPassword})
await user.save()
res.status(201).json({message:"пользователь создан"})



}catch(e){
    res.status(500).json({  message:"LOX"})
}
})
// /api/auth/register
router.post('/login',
[
    check('email','Некорректный ').normalizeEmail().isEmail(),
    check('password','Минимальная длина 6 символов').exists()
],
async (req,res)=>{
    try{
       
        const errors = validationResult(req)
        if(!errors.isEmpty){
            return res.status(400).json({
                errors: errors.array(),
                message:"Некорректные данные при входе!"
            })
        }
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Пользователь не найден!"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Неверные данные!"})
        }
        const token = jwt.sign(
            {userId:user.id},
            config.get('jwtSecret'),
            {expiresIn:'1h'}
        )
        res.json({token,userId:user.id})

    }catch(e){
        res.status(500).json({  message:"LOX"})
    }
})



module.exports = router 