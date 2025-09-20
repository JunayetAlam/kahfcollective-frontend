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
import { useGetAllTiersQuery } from "@/redux/api/tierApi";

export default function CourseForm() {
  const { data: tierData, isLoading } = useGetAllTiersQuery([]);

  return (
    <div className="space-y-4">
      {/* Course Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter course title"
          required
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the course content and objectives"
          rows={4}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        {/* Tier Level Field */}
        <div className="space-y-2">
          <Label htmlFor="tierLevel">Tier Level</Label>
          <Select name="tierLevel" required>
            <SelectTrigger>
              <SelectValue placeholder="Select tier level" />
            </SelectTrigger>
            <SelectContent>
              {tierData?.data?.map((d) => (
                <SelectItem value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
