// UsersRoutes.js
import Auth from  '../controllers/AuthController'
import Router from 'express-promise-router'
const router = Router()

// Controllers
import UsersController from '../controllers/UsersController'

// Routes
router.route('/signup')
    .post(UsersController.signUp)

router.route('/signin')
    .post(Auth.authenticate('local', { session: false }), UsersController.signIn)

router.route('/secret')
    .get(Auth.authenticate('jwt', { session: false }), UsersController.secret)

export default router