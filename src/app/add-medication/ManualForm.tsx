"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import { useDrugData } from "./useDrugData";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Select, SelectItem } from "@nextui-org/select";

const formSchema = z.object({
  drugName: z.string().min(1, "Medication name cannot be blank"),
  dosingInstruction: z.string(),
  uom: z.string().min(1, "Dose cannot be blank"),
  frequency: z.string().min(1, "Frequency cannot be blank"),
  whenRequired: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const uomData: string[] = ["HALF", "ONE", "TWO", "THREE"];
const frequencyData: string[] = [
  "ONCE A DAY",
  "2 TIME(S) A DAY",
  "3 TIME(S) A DAY",
  "4 TIME(S) A DAY",
];

const ManualForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      dosingInstruction: "",
      uom: "",
      frequency: "",
    },
  });

  // const drugName = watch("drugName");
  const uom = watch("uom");
  const frequency = watch("frequency");

  useEffect(() => {
    if (uom && frequency) {
      const dosingInstruction = `TAKE ${uom} TAB ${frequency}`;
      setValue("dosingInstruction", dosingInstruction);
    }
  }, [uom, frequency, setValue]);

  const { data: DrugData, error, isLoading } = useDrugData();
  if (!DrugData || isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = (formData: FormData) => {
    console.log(formData);
  };

  const getFullDosingInstruction = () => {
    return `TAKE ${getValues("uom")} TAB ${getValues("frequency")}`;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 md:justify-center"
      >
        <Autocomplete
          label="Select medication"
          className="w-full md:max-w-sm"
          isInvalid={errors.drugName && true}
          errorMessage={errors.drugName && errors.drugName.message}
          {...register("drugName")}
          selectedKey={watch("drugName")}
          onSelectionChange={(value) => setValue("drugName", value as string)}
        >
          {DrugData.map((item) => (
            <AutocompleteItem key={item.drugName} textValue={item.drugName}>
              {item.drugName}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Autocomplete
          label="UOM"
          className="w-full md:max-w-sm"
          isInvalid={errors.uom && true}
          errorMessage={errors.uom && errors.uom.message}
          {...register("uom")}
          selectedKey={uom}
          onSelectionChange={(value) => setValue("uom", value as string)}
        >
          {uomData.map((uom) => (
            <AutocompleteItem key={uom} textValue={uom}>
              {uom}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Autocomplete
          label="Frequency"
          className="w-full md:max-w-sm"
          isInvalid={errors.frequency && true}
          errorMessage={errors.frequency && errors.frequency.message}
          selectedKey={frequency}
          onSelectionChange={(value) => setValue("frequency", value as string)}
          {...register("frequency")}
        >
          {frequencyData.map((frequency) => (
            <AutocompleteItem key={frequency} textValue={frequency}>
              {frequency}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            label="Dosing Instruction"
            className="w-full"
            {...register("dosingInstruction")}
            value={getFullDosingInstruction()}
            isInvalid={errors.dosingInstruction && true}
            errorMessage={
              errors.dosingInstruction && errors.dosingInstruction.message
            }
            isDisabled={true}
          />
        </div>
        <Button
          color="primary"
          type="submit"
          className="max-w-40 bg-gradient-to-tr from-pink-500 to-yellow-500 self-center md:self-start"
          fullWidth
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default ManualForm;
