"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Input as ShadInput } from "@/components/ui/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import { useDrugData } from "./useDrugData";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

interface OcrData {
  data: {
    msg: string;
    status: string;
    data: {
      drugName: string;
      dosingInstruction: string;
    };
  };
}

interface ScanFormProps {
  onSubmit: (data: any) => void;
}

const dummyData: OcrData = {
  data: {
    msg: "success",
    status: "200",
    data: {
      drugName: "paracetamol 500mg",
      dosingInstruction: "take 1 tablet",
    },
  },
};

const formSchema = z.object({
  drugName: z.string().min(1, "Drug name cannot be blank"),
  dosingInstruction: z.string().min(1, "Dosing instruction cannot be blank"),
  file: z.instanceof(FileList),
});

type FormData = z.infer<typeof formSchema>;

const fetchOcrData = async (file: FileList) => {
  if (!file) {
    return console.error("No file provided");
  }

  const formData = new FormData();
  formData.set("file", file[0]);

  try {
    const response = await axios.post("/api/medications/ocr", formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  // const response = await axios.post<OcrData["data"]>("/api/medications/ocr");
  // return response.data;
  // return dummyData.data;
};

const ScanForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      dosingInstruction: "",
      file: undefined,
    },
  });

  const file = watch("file");
  const drugName = watch("drugName");
  const dosingInstruction = watch("dosingInstruction");
  const [isReadOnly, setIsReadOnly] = useState(true);
  // const [uploadFile , setUploadFile] = useState(null)

  const scanLabel = useMutation({
    mutationFn: fetchOcrData,
    onSuccess(data) {
      console.log(data);
      setValue("drugName", data.data.drugName);
      setValue("dosingInstruction", data.data.dosingInstruction);
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ drugName: "", dosingInstruction: "" });
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = (formData: FormData) => {
    console.log(formData);
  };

  const { data: DrugData, error, isLoading } = useDrugData();
  if (!DrugData || isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  console.log(file);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 md:justify-center"
      >
        <div className="flex flex-col space-y-3">
          <Label htmlFor="fileUpload" className="px-2">
            Upload Medication Label Image
          </Label>
          <div className="flex w-full items-center space-x-2">
            <ShadInput
              id="fileUpload"
              type="file"
              className="max-w-xs rounded-xl pt-1.5"
              required
              {...register("file")}
            />
            <Button
              color="primary"
              fullWidth={false}
              className="max-w-40"
              onClick={() => {
                setIsReadOnly(true);
                scanLabel.mutate(file);
              }}
              isDisabled={scanLabel.isPending}
              isLoading={scanLabel.isPending}
            >
              {scanLabel.isPending ? "Scanning..." : "Scan Label"}
            </Button>
          </div>
        </div>

        <Select
          label="Select medication"
          className="max-w-xs"
          isInvalid={errors.drugName && true}
          errorMessage={errors.drugName && errors.drugName.message}
          {...register("drugName")}
          isDisabled={isReadOnly}
          key={drugName}
        >
          {DrugData.map((item) => (
            <SelectItem key={item.drug.drugName} value={item.drug.drugName}>
              {item.drug.drugName}
            </SelectItem>
          ))}
        </Select>

        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            label="Dosing Instruction"
            className="w-full"
            {...register("dosingInstruction")}
            value={dosingInstruction}
            isInvalid={errors.dosingInstruction && true}
            errorMessage={
              errors.dosingInstruction && errors.dosingInstruction.message
            }
            isDisabled={isReadOnly}
          />
          <Button
            color="secondary"
            onClick={() => {
              setIsReadOnly(!isReadOnly);
            }}
          >
            {isReadOnly ? "Locked" : "Unlocked"}
          </Button>
        </div>
        <Button color="primary" type="submit" className="max-w-40" fullWidth>
          Submit
        </Button>
      </form>
    </>
  );
};

export default ScanForm;
