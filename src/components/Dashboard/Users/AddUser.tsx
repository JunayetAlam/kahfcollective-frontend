import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import AddSingleUserForm from "./AddSingleUser";
import { useState } from "react";
import AddMultipleUser from "./AddMultipleUser";

export default function AddUser() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Add One User</TabsTrigger>
            <TabsTrigger value="multiple">Add Multiple</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <AddSingleUserForm setOpen={setOpen} />
          </TabsContent>

          <TabsContent value="multiple">
            <AddMultipleUser setOpen={setOpen} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
