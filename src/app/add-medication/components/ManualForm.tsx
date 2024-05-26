"use client";
import React, { useEffect, useState } from "react";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@nextui-org/button";
import { useDrugData } from "../hooks/useDrugData";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormLabel,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@nextui-org/skeleton";
import useCustomToast from "@/components/useCustomToast";
import {
  fetchDrugEntry,
  fetchDrugId,
  fetchOcrData,
  submitFormData,
} from "../utils";
import { useSession } from "next-auth/react";

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
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      dosingInstruction: "",
      uom: "",
      frequency: "",
    },
  });

  const drugName = form.watch("drugName");
  const uom = form.watch("uom");
  const frequency = form.watch("frequency");
  const dosingInstruction = form.watch("dosingInstruction");
  const [drugId, setDrugId] = useState("");
  const [method, setMethod] = useState("");
  const [unitDose, setUnitDose] = useState("");
  const { data: DrugData, error, isLoading } = useDrugData();
  const { data: session } = useSession();

  const fetchDrugIdMutation = useMutation({
    mutationFn: fetchDrugId,
    onSuccess(data) {
      setDrugId(data.id.toString());
      fetchDrugEntryMutation.mutate(data.id.toString());
    },
  });

  const fetchDrugEntryMutation = useMutation({
    mutationFn: fetchDrugEntry,
    onSuccess(data) {
      console.log(data);
      setMethod(data.method);
      setUnitDose(data.unitDose);
    },
  });

  const submitForm = useMutation({
    mutationFn: submitFormData,
    onSuccess() {
      console.log("Form submitted");
      form.reset();
      setDrugId("");
      setMethod("");
      setUnitDose("");
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      await submitForm.mutateAsync({
        userId: session!.user!.id as string,
        drugId: parseInt(drugId),
        dosingInstruction: formData.dosingInstruction,
      });
      console.log("form submitted");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const getFullDosingInstruction = () => {
      const instruction = `${method} ${form.getValues(
        "uom"
      )} ${unitDose} ${form.getValues("frequency")}`;
      form.setValue("dosingInstruction", instruction);
    };

    getFullDosingInstruction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, unitDose, uom, frequency]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8 md:justify-center"
          >
            {!DrugData || isLoading ? (
              <div className="flex flex-col gap-y-2">
                <Skeleton className="h-4 w-2/5 rounded-lg opacity-70" />
                <Skeleton className="rounded-lg w-full opacity-70 h-10" />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="drugName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          setDrugId("");
                          form.setValue("drugName", value as string);
                          fetchDrugIdMutation.mutate(value as string);
                        }}
                        value={drugName}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Medication" />
                        </SelectTrigger>
                        <SelectContent>
                          {DrugData.map((item) => (
                            <SelectItem key={item.id} value={item.drugName}>
                              {item.drugName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {form.formState.errors.drugName ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Select the medication to be added
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="uom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dose</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("uom", value as string);
                        // getFullDosingInstruction();
                      }}
                      value={uom}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Dose" />
                      </SelectTrigger>
                      <SelectContent>
                        {uomData.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.uom ? <FormMessage /> : null}
                  <FormDescription>
                    Number of tablets/capsules to be taken
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("frequency", value as string);
                        // getFullDosingInstruction();
                      }}
                      value={frequency}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyData.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.frequency ? <FormMessage /> : null}
                  <FormDescription>
                    Number of times the dose should be taken in a day
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosingInstruction"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <FormItem className="w-full">
                    <FormLabel>Dosing Instruction</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dosing Instruction"
                        {...field}
                        value={dosingInstruction}
                        disabled
                      />
                    </FormControl>
                    {form.formState.errors.dosingInstruction ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Check the dosing instruction against your medication
                        label
                      </FormDescription>
                    )}
                  </FormItem>
                </div>
              )}
            />

            <Button
              className="max-w-40 bg-gradient-to-tr from-pink-500 to-yellow-500 self-center md:self-start"
              type="submit"
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Form>
      </motion.div>
    </>
  );
};

export default ManualForm;
