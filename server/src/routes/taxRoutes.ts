import express from "express";
import {
  getAllTaxes,
  createTax,
  updateTax,
  deleteTax,
} from "../controllers/taxController";

const router = express.Router();

router.route("/").get(getAllTaxes).post(createTax);

router.route("/:id").put(updateTax).delete(deleteTax);

export default router;
