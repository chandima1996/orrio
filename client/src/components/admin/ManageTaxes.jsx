import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import LoadingSpinner from "../custom/LoadingSpinner";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TaxForm = ({ onSuccess, initialData }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (values) => {
    const data = { ...values, percentage: Number(values.percentage) };
    const isEditMode = !!initialData;
    const url = isEditMode
      ? `http://localhost:5001/api/taxes/${initialData._id}`
      : "http://localhost:5001/api/taxes";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Operation failed");
      toast.success(`Tax ${isEditMode ? "updated" : "added"} successfully!`);
      onSuccess();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("name", { required: true })}
        placeholder="Tax Name (e.g., VAT)"
      />
      <Input
        {...register("percentage", { required: true })}
        type="number"
        step="0.01"
        placeholder="Percentage (e.g., 15)"
      />
      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

const ManageTaxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taxToEdit, setTaxToEdit] = useState(null);

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/taxes");
      const data = await response.json();
      setTaxes(data);
    } catch (error) {
      toast.error("Error", { description: "Failed to fetch taxes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setTaxToEdit(null);
    fetchTaxes();
  };

  const handleEditClick = (tax) => {
    setTaxToEdit(tax);
    setIsDialogOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Manage Taxes</h2>
        <Button
          onClick={() => {
            setTaxToEdit(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Tax
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{taxToEdit ? "Edit Tax" : "Add New Tax"}</DialogTitle>
          </DialogHeader>
          <TaxForm onSuccess={handleSuccess} initialData={taxToEdit} />
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tax Name</TableHead>
              <TableHead>Percentage (%)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxes.map((tax) => (
              <TableRow key={tax._id}>
                <TableCell>{tax.name}</TableCell>
                <TableCell>{tax.percentage}%</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(tax)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageTaxes;
