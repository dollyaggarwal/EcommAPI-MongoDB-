// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import { CartItemsController } from './cartitems.controller.js';

// 2. Initialize Express router.
const cartRouter = express.Router();

const cartController = new CartItemsController();

cartRouter.post('/', cartController.add);
cartRouter.get('/', cartController.get);
cartRouter.delete('/:id',cartController.delete);

export default cartRouter;