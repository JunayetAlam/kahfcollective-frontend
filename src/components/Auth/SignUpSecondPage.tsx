import { setData, useCurrentSignUpData } from "@/redux/signUpSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { FieldValues } from "react-hook-form";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import CustomRadioCheckpoint from "../Forms/CustomRadioCheckpoints";
import { Button } from "../ui/button";
import PageStep from "./PageStep";

export default function SignUpSecondPage() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(useCurrentSignUpData).data;

  const defaultValues = {
    profession: data.profession || "",
    wasTakeCourseBefore: data.wasTakeCourseBefore || "",
    coursesName: data.coursesName || "",
    isTakeCourseWithSheikh: data.isTakeCourseWithSheikh || "",
    howLongCorrespondence: data.howLongCorrespondence || "",
  };

  const handleSubmit = (formData: FieldValues) => {
    dispatch(setData({ data: formData, currentPage: 3 }));
  };
  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      className="space-y-4"
    >
      {/* Profession */}
      <CustomInput
        required
        label="What is your current profession/major in college?"
        name="profession"
        type="text"
        placeholder="profession/major"
      />

      {/* Was Take Course Before */}
      <CustomRadioCheckpoint
        name="wasTakeCourseBefore"
        label="Have you taken Islamic Courses before?"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        otherFieldName="coursesName"
        placeholder="Enter course name"
      />

      {/* Courses Name (conditional) */}
      <CustomInput
        name="coursesName"
        type="text"
        label="If yes, list them"
        placeholder="Name of the course(s) you took"
      />

      {/* Is Take Course With Sheikh */}
      <CustomRadioCheckpoint
        name="isTakeCourseWithSheikh"
        label="Have you taken courses with Sheikh Salman before?"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />

      {/* How Long Correspondence */}

      <CustomInput
        label="If yes, how long have you been taking classes with Sheikh Salman?"
        name="howLongCorrespondence"
        type="text"
        placeholder="Correspond"
      />

      <PageStep />

      <Button
        type="submit"
        className="mt-6 w-full"
        size="lg"
        variant="secondary"
      >
        Next
      </Button>
    </CustomForm>
  );
}
