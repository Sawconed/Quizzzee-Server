/**
 * @openapi
 * /admins:
 *   get:
 *     tags:
 *       - Admins
 *     summary: Get all admins
 *     description: Get all admins
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by isActive
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       '400':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /admins/{adminId}:
 *   get:
 *     tags:
 *       - Admins
 *     summary: Get admin by id
 *     description: Get admin by id
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin id
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: Admin not found
 */

/**
 * @openapi
 * /admins:
 *   post:
 *     tags:
 *       - Admins
 *     summary: Create admin
 *     description: Create admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required: true
 *     responses:
 *       '201':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       '400':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /admins/block/{adminId}:
 *   put:
 *     tags:
 *       - Admins
 *     summary: Block admin by id
 *     description: Block admin by id
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin id
 *     responses:
 *       '201':
 *         description: Success
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: Admin not found
 */

/**
 * @openapi
 * /admins/unblock/{adminId}:
 *   put:
 *     tags:
 *       - Admins
 *     summary: Unblock admin by id
 *     description: Unblock admin by id
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin id
 *     responses:
 *       '201':
 *         description: Success
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: Admin not found
 */

/**
 * @openapi
 * /admins/{adminId}:
 *   delete:
 *     tags:
 *       - Admins
 *     summary: Delete admin by id
 *     description: Delete admin by id
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin id
 *     responses:
 *       '201':
 *         description: Success
 *       '400':
 *         description: Internal Server Error
 *       '404':
 *         description: Admin not found
 */