const { User } = require('../models')
const middleware = require('../middleware')


const register = async (req,res)=>{try{
  const{name,email,password}= req.body

  let passwordDigest = await middleware.hashPassword(password)

  let existingUser= await User.exists({email})
  if (existingUser) {return res.status (400).send('email has already been registered')}
  else {const user = await User.create({username, fullname, email, passwordDigest, user_role, department})
res.status(200).send(user)
}
} catch (error){
  throw error
}
}

const login = async (req,res) => {
  try{
    const{email,password}= req.body

    const user = await User.findOne({email})

    let matched = await middleware.comparePassword(password,user.passwordDigest)
    if (matched){let payload ={
      id:user._id,
      name:user.name,
      email: user.email,
    user_role:user.user_role}

      let token = middleware.createToken(payload)
      return res.status(200).send({user:payload, token})
    }
res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    res.status(401).send({ status: 'Error', msg: '  logging in error!' })
  }
  }

  const updatePassword = async (req,res)=>{
    try{
      const {oldPassword,newPassword}=req.body

      let user = await User.findById(req.params.id)

      let matched = await middleware.comparePassword(oldPassword,user.passwordDigest)
      if (matched){
        let passwordDigest= await middleware.hashPassword(newPassword)
        user = await User.findByIdAndUpdate(req.params.id,{passwordDigest})
        let payload ={
          id:user._id,
          name:user.name,
          email:user.email
        }
        return res.status(200).send({status:'Password has been updated',user:payload})
      }
      res.status(401).send({status: 'Error', msg: 'Old Password did not match!' })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: 'Error',
      msg: ' Updating password error !'})
    }
  }

  const checkSession = async (req,res) => { const {payload}= res.locals
  res.status(200).send(payload)
}

module.exports = {
  register,
  login,
  updatePassword,
  checkSession
}
