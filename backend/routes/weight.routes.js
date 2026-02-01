import { Router } from 'express'
import { addWeight, getWeight } from '../controllers/weight.controller.js';


const weightRouter = Router();

weightRouter.post('/add-weight', addWeight);
weightRouter.get('/get-weight', getWeight);

export default weightRouter;