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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import LoadingSpinner from "../custom/LoadingSpinner";
import UserForm from "./UserForm";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [isRoleConfirmDialogOpen, setIsRoleConfirmDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdateRole, setUserToUpdateRole] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/users");
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChangeClick = (user, newRole) => {
    setUserToUpdateRole({ user, newRole });
    setIsRoleConfirmDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!userToUpdateRole) return;
    const { user, newRole } = userToUpdateRole;
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${user.id}/role`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (!response.ok) throw new Error("Failed to update role.");

      toast.success("Success", {
        description: `User role has been changed to ${newRole}.`,
      });
      fetchUsers();
    } catch (error) {
      toast.error("Error", { description: error.message });
    } finally {
      setIsRoleConfirmDialogOpen(false);
      setUserToUpdateRole(null);
    }
  };

  const handleDialogClose = () => {
    setIsFormDialogOpen(false);
    setUserToEdit(null);
  };

  const handleFormSuccess = () => {
    handleDialogClose();
    fetchUsers();
  };

  const handleEditClick = (user) => {
    const formData = {
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      contactNo: user.publicMetadata.contactNo || "",
    };
    setUserToEdit(formData);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${userToDelete.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete user.");
      toast.success("Deleted!", { description: `User has been removed.` });
      fetchUsers();
    } catch (error) {
      toast.error("Error!", { description: error.message });
    } finally {
      setIsConfirmDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="mb-4 text-2xl font-bold">Manage Users</h2>

      <Dialog open={isFormDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={handleFormSuccess} initialData={userToEdit} />
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">
                Contact No.
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName || "N/A"} {user.lastName}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {user.emailAddresses[0]?.emailAddress}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.publicMetadata.contactNo || "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.publicMetadata.role === "admin"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.publicMetadata.role || "user"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditClick(user)}>
                        Edit Details
                      </DropdownMenuItem>
                      {user.publicMetadata.role === "admin" ? (
                        <DropdownMenuItem
                          onClick={() => handleRoleChangeClick(user, "user")}
                        >
                          Make User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleRoleChangeClick(user, "admin")}
                        >
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-500 hover:!text-red-500"
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for{" "}
              {userToDelete?.emailAddresses[0]?.emailAddress}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isRoleConfirmDialogOpen}
        onOpenChange={setIsRoleConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the role for
              <span className="font-bold">
                {" "}
                {userToUpdateRole?.user.emailAddresses[0]?.emailAddress}{" "}
              </span>
              to{" "}
              <span className="font-bold uppercase">
                {" "}
                {userToUpdateRole?.newRole}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Yes, Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageUsers;
