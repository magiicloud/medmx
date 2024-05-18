"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input as ShadInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import { useDrugData } from "./useDrugData";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Progress } from "@nextui-org/progress";
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
import { LockClosedIcon, LockOpen2Icon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/auth";

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

const formSchema = z.object({
  drugName: z.string().min(1, "Drug name cannot be blank"),
  dosingInstruction: z.string().min(1, "Dosing instruction cannot be blank"),
  file: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SubmittedData {
  userId: string;
  drugId: number;
  dosingInstruction: string;
}

const fetchOcrData = async (
  file: File,
  setProgress: (progress: number) => void
) => {
  if (!file) {
    return console.error("No file provided");
  }

  const formData = new FormData();
  formData.set("file", file);

  try {
    const response = await axios.post("/api/medications/ocr", formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

const fetchDrugId = async (drugName: string): Promise<{ id: number }> => {
  const encodedDrugName = encodeURIComponent(drugName);
  try {
    const response = await axios.get(`/api/medications/ocr/${encodedDrugName}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Drug ID:", error);
    throw error;
  }
};

const submitFormData = async (submittedData: SubmittedData) => {
  try {
    const response = await axios.post("/api/medications/user", submittedData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

const ScanForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      dosingInstruction: "",
      file: undefined,
    },
  });

  const file = form.watch("file");
  const drugName = form.watch("drugName");
  const dosingInstruction = form.watch("dosingInstruction");
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [drugId, setDrugId] = useState("");
  const [progress, setProgress] = useState(0);
  const { status, data: session } = useSession();
  const customSession = session as CustomSession | null;

  const scanLabel = useMutation({
    mutationFn: (file: File) => fetchOcrData(file, setProgress),
    onSuccess(data) {
      console.log(data);
      form.setValue("drugName", data.data.drugName);
      form.setValue("dosingInstruction", data.data.dosingInstruction);
      form.setValue("file", undefined);
      // Fetch drug ID based on the drug name
      fetchDrugIdMutation.mutate(data.data.drugName);
    },
  });

  const fetchDrugIdMutation = useMutation({
    mutationFn: fetchDrugId,
    onSuccess(data) {
      setDrugId(data.id.toString());
    },
  });

  const submitForm = useMutation({
    mutationFn: submitFormData,
    onSuccess() {
      console.log("Form submitted");
      form.reset();
      setDrugId("");
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      await submitForm.mutateAsync({
        userId: customSession!.userId,
        drugId: parseInt(drugId),
        dosingInstruction: formData.dosingInstruction,
      });
      console.log("form submitted");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const { data: DrugData, error, isLoading } = useDrugData();

  if (!DrugData || isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8 md:justify-center"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <Label>Upload Medication Label Image</Label>
                <div className="flex w-full items-center space-x-2">
                  <FormControl>
                    <ShadInput
                      type="file"
                      className="w-full rounded-xl pt-1.5"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          field.onChange(files[0]);
                        }
                      }}
                    />
                  </FormControl>

                  <Button
                    color="primary"
                    fullWidth={false}
                    className="max-w-40"
                    onClick={() => {
                      const uploadedFile =
                        file instanceof FileList ? file[0] : file;
                      if (!uploadedFile) {
                        return console.error("No file provided");
                      }
                      setIsReadOnly(true);
                      scanLabel.mutate(uploadedFile);
                    }}
                    isDisabled={scanLabel.isPending}
                    isLoading={scanLabel.isPending}
                  >
                    {scanLabel.isPending
                      ? progress !== 100
                        ? "Uploading"
                        : "Scanning"
                      : "Scan Label"}
                  </Button>
                </div>
                {scanLabel.isPending && (
                  <Progress
                    aria-label="Loading..."
                    value={progress}
                    size="sm"
                    color="primary"
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drugName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication Name</FormLabel>
                <FormControl>
                  <Select
                    disabled={isReadOnly}
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
                    Check if the medication retrieved is correct
                  </FormDescription>
                )}
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
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  {form.formState.errors.dosingInstruction ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Check if the dosing instruction retrieved is correct
                    </FormDescription>
                  )}
                </FormItem>
                <Button
                  color="secondary"
                  isIconOnly
                  isDisabled={scanLabel.isPending}
                  onClick={() => {
                    setIsReadOnly(!isReadOnly);
                  }}
                >
                  {isReadOnly ? <LockClosedIcon /> : <LockOpen2Icon />}
                </Button>
              </div>
            )}
          />

          <Button
            className="max-w-40 bg-gradient-to-tr from-pink-500 to-yellow-500 self-center md:self-start"
            type="submit"
            isDisabled={scanLabel.isPending}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ScanForm;
