import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Tax from "../models/taxModel";

// @desc    Fetch all taxes (or create a default one if none exist)
// @route   GET /api/taxes
const getAllTaxes = asyncHandler(async (req: Request, res: Response) => {
  let taxes = await Tax.find({});

  // If no taxes exist, create a default one
  if (taxes.length === 0) {
    const defaultTax = new Tax({
      name: "Standard VAT",
      percentage: 15,
      isDefault: true,
    });
    const createdTax = await defaultTax.save();
    taxes = [createdTax]; // Return the newly created tax in an array
  }

  res.json(taxes);
});

// @desc    Create a new tax
// @route   POST /api/taxes
const createTax = asyncHandler(async (req: Request, res: Response) => {
  const { name, percentage } = req.body;
  const tax = new Tax({ name, percentage, isDefault: false });
  const createdTax = await tax.save();
  res.status(201).json(createdTax);
});

// @desc    Update a tax
// @route   PUT /api/taxes/:id
const updateTax = asyncHandler(async (req: Request, res: Response) => {
  const tax = await Tax.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!tax) {
    res.status(404).json({ message: "Tax not found" });
    return;
  }
  res.json(tax);
});

// @desc    Delete a tax
// @route   DELETE /api/taxes/:id
const deleteTax = asyncHandler(async (req: Request, res: Response) => {
  const tax = await Tax.findByIdAndDelete(req.params.id);
  if (!tax) {
    res.status(404).json({ message: "Tax not found" });
    return;
  }
  res.json({ message: "Tax removed" });
});

export { getAllTaxes, createTax, updateTax, deleteTax };
