import CustomForm from "@/components/Forms/CustomForm";
import Spinner from "@/components/Global/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMultipleUsersMutation } from "@/redux/api/userApi";
import { ArrowUpRight, File, Plus, X } from "lucide-react";
import { useRef } from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
type UserType = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  isUserVerified: "YES" | "NO";
  gender: "MALE" | "FEMALE";
  address: string;
  phoneNumber: string;
  introduction: string;
  currentClass: string;
  roll: string;
  subject: string;
};

const defaultValues = {
  users: [
    {
      id: "1",
      fullName: "",
      email: "",
      password: "",
      isUserVerified: "NO",
      gender: "MALE",
      address: "",
      phoneNumber: "",
      introduction: "",
      currentClass: "",
      roll: "",
      subject: "",
    },
  ],
};

export default function AddMultipleUser({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const [createMultipleUsers, { isLoading }] = useCreateMultipleUsersMutation();

  const handleSave = async (data: FieldValues) => {
    const toastId = toast.loading("Creating user...");
    try {
      const updatedData = data.users.map((item: any) => ({
        ...item,
        isUserVerified: item.isUserVerified === "YES" ? true : false,
        gender: item.gender === "MALE" ? "MALE" : "FEMALE",
        roll: Number(item.roll),
        id: undefined,
      }));
      console.log("Multiple user data:", updatedData);
      await createMultipleUsers({ users: updatedData }).unwrap();
      setOpen(false);
      toast.success("Users created successfully", { id: toastId });
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to create users", {
        id: toastId,
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <CustomForm
      onSubmit={handleSave}
      defaultValues={defaultValues}
      className="bg-background border-border rounded-lg border p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground text-lg font-semibold">
          Add Multiple Users
        </h3>
      </div>
      <AddMultipleUserForm isLoading={isLoading} />
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="text-muted-foreground"
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>

        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <ArrowUpRight className="h-4 w-4" />}
          Proceed
        </Button>
      </div>
    </CustomForm>
  );
}

const AddMultipleUserForm = ({ isLoading }: { isLoading: boolean }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const importRef = useRef<HTMLInputElement>(null);
  return (
    <Controller
      name={"users"}
      control={control}
      render={({ field }) => {
        const value: UserType[] = field.value;
        console.log(value);
        const addAnotherUser = () => {
          field.onChange([
            {
              id: new Date().getTime().toString(),
              fullName: "",
              email: "",
              password: "",
              isUserVerified: "NO",
              gender: "MALE",
              address: "",
              phoneNumber: "",
              introduction: "",
              currentClass: "",
              roll: "",
              subject: "",
            },
            ...value,
          ]);
        };
        const handleInputChange = (
          id: string,
          name: string,
          incomingValue: string,
        ) => {
          field.onChange(
            value.map((item) =>
              item.id === id ? { ...item, [name]: incomingValue } : item,
            ),
          );
        };
        const handleClickCsv = () => {
          importRef.current?.click();
        };

        const handleImport = () => {
          const file = importRef.current?.files?.[0];
          if (!file) return;

          const reader = new FileReader();

          reader.onload = (event) => {
            const csvData = event.target?.result;
            console.log("RAW CSV:", csvData);

            if (!csvData) {
              toast.error("CSV file is empty");
              return;
            }

            const lines = csvData
              .toString()
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

            if (lines.length < 2) {
              toast.error("CSV is empty or missing data rows");
              return;
            }

            // Validate header
            const header = lines[0].split(",").map((h) => h.trim());
            const expectedHeader = [
              "id",
              "fullName",
              "email",
              "password",
              "isUserVerified",
              "gender",
              "address",
              "phoneNumber",
              "introduction",
              "currentClass",
              "roll",
              "subject",
            ];

            const isHeaderValid = expectedHeader.every(
              (h, i) => h === header[i],
            );
            if (!isHeaderValid) {
              toast.error(
                "CSV header is invalid. Expected columns: " +
                  expectedHeader.join(", "),
              );
              return;
            }

            const dataLines = lines.slice(1);
            const users: any[] = [];

            for (let index = 0; index < dataLines.length; index++) {
              const line = dataLines[index];

              // Split CSV line respecting quotes
              const values = line
                .match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
                ?.map((val) => val.replace(/^"|"$/g, ""));

              if (!values) {
                toast.error(`Row ${index + 2} is empty or invalid`);
                return;
              }

              if (values.length !== expectedHeader.length) {
                toast.error(
                  `Row ${index + 2} has ${values.length} columns, expected ${expectedHeader.length}. Please check the CSV.`,
                );
                return;
              }

              const [
                id,
                fullName,
                email,
                password,
                isUserVerified,
                gender,
                address,
                phoneNumber,
                introduction,
                currentClass,
                roll,
                subject,
              ] = values;

              users.push({
                id: uuidv4(),
                fullName,
                email,
                password,
                isUserVerified,
                gender,
                address,
                phoneNumber,
                introduction,
                currentClass,
                roll,
                subject,
              });
            }

            console.log("PARSED USERS:", users);
            field.onChange([...users, ...value]);
            toast.success(`Imported ${users.length} users successfully`);
          };

          reader.readAsText(file);
        };

        return (
          <div className="space-y-5">
            <div className="space-x-4 text-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAnotherUser}
                className="text-muted-foreground"
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClickCsv}
                className="text-muted-foreground"
              >
                <File className="h-4 w-4" /> Import from CSV
              </Button>
            </div>

            <div className="flex flex-col gap-8">
              {value.map((user, index) => (
                <div className="space-y-3" key={user.id}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Student {index + 1}
                    </h2>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        field.onChange(
                          value.filter((item) => item.id !== user.id),
                        );
                      }}
                      className="text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={(e) =>
                          handleInputChange(user.id, "fullName", e.target.value)
                        }
                        placeholder="Enter full name"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={(e) =>
                          handleInputChange(user.id, "email", e.target.value)
                        }
                        placeholder="Enter email"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="text"
                        name="password"
                        value={user.password}
                        onChange={(e) =>
                          handleInputChange(user.id, "password", e.target.value)
                        }
                        placeholder="Enter password"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>User Verified</Label>
                      <Select
                        name="isUserVerified"
                        value={user.isUserVerified}
                        onValueChange={(value) =>
                          handleInputChange(user.id, "isUserVerified", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user verified" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YES">Yes</SelectItem>
                          <SelectItem value="NO">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        name="gender"
                        value={user.gender}
                        onValueChange={(value) =>
                          handleInputChange(user.id, "gender", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        required
                        type="text"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={(e) =>
                          handleInputChange(
                            user.id,
                            "phoneNumber",
                            e.target.value,
                          )
                        }
                        placeholder="Enter phone number"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        required
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={(e) =>
                          handleInputChange(user.id, "address", e.target.value)
                        }
                        placeholder="Enter address"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Current Class</Label>
                      <Input
                        type="text"
                        name="currentClass"
                        value={user.currentClass}
                        onChange={(e) =>
                          handleInputChange(
                            user.id,
                            "currentClass",
                            e.target.value,
                          )
                        }
                        placeholder="Enter current class"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Roll</Label>
                      <Input
                        type="number"
                        name="roll"
                        value={user.roll}
                        onChange={(e) =>
                          handleInputChange(user.id, "roll", e.target.value)
                        }
                        placeholder="Enter roll"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        type="text"
                        name="subject"
                        value={user.subject}
                        onChange={(e) =>
                          handleInputChange(user.id, "subject", e.target.value)
                        }
                        placeholder="Enter subject"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        type="text"
                        name="subject"
                        value={user.subject}
                        onChange={(e) =>
                          handleInputChange(user.id, "subject", e.target.value)
                        }
                        placeholder="Enter subject"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Introduction</Label>
                      <Textarea
                        className="md:col-span-2"
                        name="introduction"
                        value={user.introduction}
                        onChange={(e) =>
                          handleInputChange(
                            user.id,
                            "introduction",
                            e.target.value,
                          )
                        }
                        placeholder="Enter introduction"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={importRef}
              onChange={handleImport}
            />
          </div>
        );
      }}
    />
  );
};
