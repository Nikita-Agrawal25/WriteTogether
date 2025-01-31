const User = require("../models/User");
const { oauth2client } = require("../utils/googleClient");
const axios = require('axios')
const jwt = require('jsonwebtoken')


// Get google authentication api
const googleAuth =  ( async (req, res) => {
    try{
        const {code} = req.query;
        const googleResponse = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleResponse.tokens);

        const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)
        // console.log(userResponse);

        const {email, name, picture} = userResponse.data;

        let user = await User.findOne({email});

        if(!user){
            user = await User.create({
                name, 
                email,
                image: picture
            })
        }

        const {_id} = user;
        const token = jwt.sign({_id, email},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );
        res.status(200).json({
            message: 'success',
            token,
            user,
        });

    } catch(e){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

module.exports = googleAuth;


