// UsersController.js

import { Request, Response, NextFunction } from 'express'
import JWT from 'jsonwebtoken'
import bc from 'bcryptjs'
import db from '../database/connection'
import dotenv from 'dotenv'
dotenv.config()

// User scheema
interface User {
    id: number
    name: string
    email: string
}

// Gererates a token for the user
const signToken = (user: {id:number | null}) => {
    return JWT.sign({
        iss: process.env.HOST || 'http://localhost',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.API_KEY || 'SECRET')
}

export default {
    // Create a new account and return a access token
    signUp: async (req:Request, res:Response, _:NextFunction) => {
        const { name, email, password } = req.body 

        // Verifies if user exists
        const alreadyExists = await db('users').where({email}).select().first()
        if(alreadyExists) return res.status(409).send({error:'User Already exists!'})

        // Inserts a new user returning the user Id
        const userId = await db('users').insert({name, email, password: await bc.hash(password, await bc.genSalt(10))})

        // Gererates a token for the user
        let user = { id: userId[0]}
        const token = signToken(user as User)

        // Returns the access token
        return res.status(200).send({token})
    },
    // Returns a token for the user
    signIn: async (req:Request, res:Response, _:NextFunction) => {
        const token = signToken(req.user as User)

        // Returns the access token
        return res.status(200).send({token})
    },
    // Protected Route
    secret: async (req:Request, res:Response, _:NextFunction) => {
        const user = req.user as User
        return res.send({msg: `Welcome ${user.name}!`})
    }
}