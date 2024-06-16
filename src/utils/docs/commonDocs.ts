/**
 * @openapi
 * /commons/login:
 *   post:
 *     tags:
 *       - Commons
 *     summary: login for user              
 *     description: login using email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             rememberMe:
 *               type: string
 *           required:
 *             - email
 *             - password 
 *           example:
 *             email: user@gmail.com
 *             password: user123
 *     responses:
 *       '201':
 *         description: Login Success
 *         content:
 *           application/json:
 *            schema:
 *             type: object
 *            properties:
 *              user_id:
 *                type: string
 *              access:
 *                type: string
 *            example:
 *              user_id: 66d69e4e61fde8d0690d1b0
 *              access: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGQ2OWU0ZTYxZmRlOGQwNjkwZDFiMCIsImlhdCI6MTYzMTQwNjQwMCwiZXhwIjoxNjMxNDA2NzAwfQ.1
 *       '400':
 *         description: Invalid Credentials
 */

/**
 * @openapi
 * /commons/signup:
 *   post:
 *     tags:
 *       - Commons
 *     summary: sign up for user
 *     description: sign up using username, email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - username
 *             - email
 *             - password
 *           example:
 *             username: SawconedSway
 *             email: sawconed@gmail.com
 *             password: sawconedDeezNut
 *     responses:
 *       "201":
 *         description: Signup Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               user:
 *                 type: string
 *             example:
 *               user: 66d69e4e61fde8d0690d1b0
 *       "400":
 *         description: Invalid Data
 */

/**
 * @openapi
 * /commons/login/admin:
 *   post:
 *     tags:
 *       - Commons
 *     summary: login for admin
 *     description: login using email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - email
 *             - password
 *           example:
 *             email: admin@gmail.com
 *             password: admin123
 *     responses:
 *       "201":
 *         description: Login Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               access:
 *               type: string
 *             example:
 *               access: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGQ2OWU0ZTYxZmRlOGQwNjkwZDFiMCIsImlhdCI6MTYzMTQwNjQwMCwiZXhwIjoxNjMxNDA2NzAwfQ.1   
 *               admin_id: 664d69e4e61fde8d0690d1b0
 *               isSuper: false
 *       "400":
 *         description: Invalid Credentials
 */

/**
 * @openapi
 * /commons/search:
 *   get:
 *     tags:
 *       - Commons
 *     summary: Search for users or quizzies
 *     description: Search for users or quizzies
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Search for users
 *       - in: query
 *         name: quizzzy
 *         schema:
 *           type: string
 *         description: Search for quizzies
 *     responses:
 *       "200":
 *         description: Success
 *       "404":
 *         description: Not Found		
 *       "400":
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /commons/logout:
 *   get:
 *     tags:
 *       - Commons
 *     summary: Logout
 *     description: Logout
 *     responses:
 *       "200":
 *         description: Success
 *       "400":
 *         description: Internal Server Error
 */