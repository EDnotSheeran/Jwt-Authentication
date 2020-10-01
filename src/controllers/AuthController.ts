import { Strategy as JwtStrategy }  from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { ExtractJwt } from 'passport-jwt'
import bc from 'bcryptjs'
import passport from 'passport'
import db from '../database/connection'
import dotenv from 'dotenv'
dotenv.config()

// Token Auth
passport.use(new JwtStrategy({
    secretOrKey: process.env.API_KEY,
    jwtFromRequest:ExtractJwt.fromHeader('authorization')
}, async (payload, done) =>{
    try {
        // If doesn't find the user
        const user = await db('users').select().where({id: payload.sub}).first()
        if(!user) return done(null, false)

        // Otherwise
        return done(null, user)
    } catch (error) {
        console.log(error)
        return done(error,  false)
    }
}))

// Password Auth
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email: string, password: string, done)=> {
    try {
        // If doesn't find the user
        const user = await db('users').select(['id','name','email']).where({ email }).first()
        if(!user) return done(null, false)
        
        // If the password doesn't match
        const match = await passwordMatches(email, password)
        if(!match) return done(null, false)
        
        // Otherwise
        done(null, user)
    } catch (error) {
        return done(error, false)
    }
})) 

// Verifies if the users password matches
async function passwordMatches(email: string, newPassword: string) {
    try {
        const { password } = await db('users').where({email}).first()
        return await bc.compare(newPassword, password)
    } catch (error) {
        console.log(error)
        return false
    }
}   
export default passport