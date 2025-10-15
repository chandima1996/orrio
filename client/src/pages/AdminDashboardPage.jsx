import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, BedDouble, Users, Percent } from "lucide-react";
import ManageHotels from "../components/admin/ManageHotels";
import ManageRooms from "../components/admin/ManageRooms";
import ManageUsers from "@/components/admin/ManageUsers";
import ManageTaxes from "@/components/admin/ManageTaxes";

const AdminDashboardPage = () => {
  return (
    <div className="container px-4 pt-24 mx-auto">
      <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>

      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="hotels">
            <Building2 className="w-4 h-4 mr-2" /> Manage Hotels
          </TabsTrigger>
          <TabsTrigger value="rooms">
            <BedDouble className="w-4 h-4 mr-2" /> Manage Rooms
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" /> Manage Users
          </TabsTrigger>
          <TabsTrigger value="taxes">
            <Percent className="w-4 h-4 mr-2" /> Manage Taxes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="mt-6">
          <ManageHotels />
        </TabsContent>
        <TabsContent value="rooms" className="mt-6">
          <ManageRooms />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <ManageUsers /> {/* 2. USE THE COMPONENT */}
        </TabsContent>
        <TabsContent value="taxes" className="mt-6">
          <ManageTaxes /> {/* 2. USE THE COMPONENT */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
