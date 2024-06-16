/**
 * @openapi
 * /users:
 *    get:
 *      tags:
 *        - Users
 *      summary: Get all users
 *      description: Get all users
 *      parameters:
 *        - in: query
 *          name: isActive
 *          schema:
 *            type: boolean
 *          description: Filter by isActive
 *      responses:
 *        '200':
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User' 
 *        '400':
 *          description: Internal Server Error
 */

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users  
 *     summary: Get user by id
 *     description: Get user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: User not found
 */

/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by id
 *     description: Update user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: User not found
 */

/**
 * @openapi
 * /users/block/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Block user by id
 *     description: Block user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: User not found
 */

/**
 * @openapi
 * /users/unblock/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Unblock user by id
 *     description: Unblock user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: User not found
 */

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by id
 *     description: Delete user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: User not found
 */

/**
 * @openapi
 * /users/favorite/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Add favorite quizzzy
 *     description: Add favorite quizzzy
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             quizzzyId:
 *               type: string
 *           required: true
 *           description: Quizzzy id
 *           example:
 *             quizzzyId: 664d69e4e61fde8d0690d1b0
 *     responses:
 *       '201':
 *         description: Success
 *       '409':
 *         description: Quizzzy already in favorites
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /users/unfavorite/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Remove favorite quizzzy
 *     description: Remove favorite quizzzy
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             quizzzyId:
 *               type: string
 *           required: true
 *           description: Quizzzy id
 *           example:
 *             quizzzyId: 664d69e4e61fde8d0690d1b0
 *     responses:
 *       '201':
 *         description: Success
 *       '500':
 *         description: Internal Server Error
 *       '404':
 *         description: Quizzzy not found
 */