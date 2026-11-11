import { Router } from "express";
import createOrder from "../controllers/orderController";
import validateDto from "../middlewares/validateDto";
import CreateOrderDto from "../dto/createOrderDto.dto";

const router = Router();

router.post("/", validateDto(CreateOrderDto), createOrder);

export default router;
