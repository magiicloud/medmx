"use client";
import React, { useState } from "react";
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
  drugName: z.string().min(1, "Required"),
  dosingInstruction: z.string(),
  uom: z.string(),
  frequency: z.string(),
  whenRequired: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const fetchOcrData = async () => {
  // const response = await axios.post<OcrData["data"]>("/api/medications/ocr");
  // return response.data;
  return dummyData.data;
};

const AddMedication = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      dosingInstruction: "",
    },
  });

  const drugName = watch("drugName");
  const dosingInstruction = watch("dosingInstruction");
  const [isReadOnly, setIsReadOnly] = useState(true);

  const scanLabel = useMutation({
    mutationFn: fetchOcrData,
    onSuccess(data) {
      console.log(data);
      setValue("drugName", data.data.drugName);
      setValue("dosingInstruction", data.data.dosingInstruction);
    },
  });

  const { data: DrugData, error, isLoading } = useDrugData();
  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const onSubmit = (formData: FormData) => {
    console.log(formData);
  };

  return (
    <>
      <div className="min-h-screen mx-10 max-w-screen-2xl grid md:grid-cols-2 md:gap-x-12">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-center pb-6">
            Add Medication
          </h1>
          <p className="text-sm text-center">
            You can upload an image of the drug label to extract the medication
            name and dosing instructions
          </p>
        </div>

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
              />
              <Button
                color="primary"
                fullWidth={false}
                className="max-w-40"
                onClick={() => {
                  setIsReadOnly(true);
                  scanLabel.mutate();
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
            key={drugName}
            isDisabled={isReadOnly}
          >
            {DrugData
              ? DrugData.map((drug) => (
                  <SelectItem key={drug.drugName} value={drug.drugName}>
                    {drug.drugName}
                  </SelectItem>
                ))
              : []}
          </Select>
          <Select
            label="UOM"
            className="max-w-xs"
            isInvalid={errors.uom && true}
            errorMessage={errors.uom && errors.uom.message}
            {...register("uom")}
            isDisabled={isReadOnly}
            onChange={(e) => {
              const newUom = e.target.value;
              setValue("uom", newUom);
              setValue(
                "dosingInstruction",
                `${newUom} ${getValues("frequency")}`
              );
            }}
          >
            <SelectItem key={"ONE"}>1</SelectItem>
          </Select>
          <Select
            label="Frequency"
            className="max-w-xs"
            isInvalid={errors.frequency && true}
            errorMessage={errors.frequency && errors.frequency.message}
            {...register("frequency")}
            isDisabled={isReadOnly}
            onChange={(e) => {
              const newFrequency = e.target.value;
              setValue("frequency", newFrequency);
              setValue(
                "dosingInstruction",
                `${getValues("uom")} ${newFrequency}`
              );
            }}
          >
            <SelectItem key={"3 TIMES A DAY"}>3 TIMES A DAY</SelectItem>
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
              color="primary"
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
      </div>
    </>
  );
};

export default AddMedication;
