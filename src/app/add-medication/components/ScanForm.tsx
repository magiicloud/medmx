"use client";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input as ShadInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@nextui-org/button";
import { useDrugData } from "../hooks/useDrugData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Progress } from "@nextui-org/progress";
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
import { LockClosedIcon, LockOpen2Icon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/skeleton";
import useCustomToast from "@/components/useCustomToast";
import { fetchDrugId, fetchOcrData, submitFormData } from "../utils";
import useJobStatusChecker from "./JobStatusTracker";
import { useJobData } from "../hooks/useJobData";
import { deleteJob } from "../utils";
import { Card, CardBody } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { Tooltip } from "@nextui-org/tooltip";
import Link from "next/link";

const formSchema = z.object({
  drugName: z.string().min(1, "Drug name cannot be blank"),
  dosingInstruction: z.string().min(1, "Dosing instruction cannot be blank"),
  file: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ScanForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      dosingInstruction: "",
      file: undefined,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const file = form.watch("file");
  const drugName = form.watch("drugName");
  const dosingInstruction = form.watch("dosingInstruction");
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [drugId, setDrugId] = useState("");
  const [progress, setProgress] = useState(0);
  const { data: session } = useSession();
  const { displayToast } = useCustomToast();
  const { data: DrugData, error, isLoading } = useDrugData();
  const {
    data: userJobs,
    error: jobsError,
    isLoading: jobsIsLoading,
  } = useJobData();
  const checkJobStatus = useJobStatusChecker();
  const queryClient = useQueryClient();
  const userId = session?.user?.id ?? "";

  const scanLabel = useMutation({
    mutationFn: (file: File) => fetchOcrData(file, setProgress),
    onSuccess(data) {
      displayToast("default", undefined, "Added to queue for scanning");
      checkJobStatus();
      form.resetField("file", undefined);

      // Clear the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // form.setValue("drugName", data.data.drugName);
      // form.setValue("dosingInstruction", data.data.dosingInstruction);
      // form.setValue("file", undefined);
      // form.resetField("file", { defaultValue: undefined });
      // Fetch drug ID based on the drug name
      // fetchDrugIdMutation.mutate(data.data.drugName);
    },
  });

  const fetchDrugIdMutation = useMutation({
    mutationFn: fetchDrugId,
    onSuccess(data) {
      setDrugId(data.id.toString());
    },
  });

  const deleteJobFromDb = useMutation({
    mutationFn: (jobId: number) => deleteJob(userId, jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userJobs"] });
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
        userId: userId,
        drugId: parseInt(drugId),
        dosingInstruction: formData.dosingInstruction,
      });
      displayToast(
        "default",
        "Success",
        "Added to medication list successfully"
      );
      console.log("form submitted");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
                        ref={fileInputRef} // Add ref to file input
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
                      className="max-w-40 bg-[#6faed6] text-white"
                      onClick={() => {
                        const uploadedFile =
                          file instanceof FileList ? file[0] : file;
                        if (!uploadedFile) {
                          form.setError("file", {
                            type: "manual",
                            message: "No file provided",
                          });
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
                  {form.formState.errors.file?.message && <FormMessage />}
                </FormItem>
              )}
            />
            {!userJobs || jobsIsLoading ? (
              <Spinner />
            ) : (
              <Tooltip
                content="Click to add them to the fields below"
                color="primary"
                size="sm"
                placement="bottom-end"
                showArrow
              >
                <Card isBlurred>
                  <CardBody>
                    <div
                      className={`flex ${
                        userJobs && userJobs.length !== 0
                          ? "flex-wrap gap-2 max-h-24 overflow-auto"
                          : "justify-center items-center h-full w-full"
                      }`}
                    >
                      {userJobs && userJobs.length !== 0 ? (
                        userJobs.map((job) => (
                          <div key={job.jobId} className="">
                            <Button
                              size="sm"
                              variant="ghost"
                              radius="full"
                              onClick={() => {
                                form.setValue("drugName", job.drugName);
                                fetchDrugIdMutation.mutate(job.drugName);
                                form.setValue(
                                  "dosingInstruction",
                                  job.dosingInstruction
                                );
                                deleteJobFromDb.mutate(job.id);
                              }}
                            >
                              {job.drugName}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm p-y-3">
                          There are no scanned images...
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Tooltip>
            )}

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
            )}

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
                  <Tooltip
                    content="You can edit the fields after scanning the label"
                    color="primary"
                    size="sm"
                    placement="top-end"
                    showArrow
                  >
                    <Button
                      color="secondary"
                      className="bg-[#ff85a1] text-white"
                      isIconOnly
                      isDisabled={scanLabel.isPending}
                      onClick={() => {
                        setIsReadOnly(!isReadOnly);
                      }}
                    >
                      {isReadOnly ? <LockClosedIcon /> : <LockOpen2Icon />}
                    </Button>
                  </Tooltip>
                </div>
              )}
            />

            <Button
              className="max-w-40 bg-[#ff9a76] text-white self-center md:self-start"
              type="submit"
              isDisabled={scanLabel.isPending}
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Form>
        <Button
          variant="ghost"
          onClick={() => {
            displayToast(
              "default",
              "Jobs Completed",
              <>
                <Button size="sm" variant="ghost" className="mt-2 mr-2">
                  <Link href="/add-medication">Click</Link>
                </Button>
                to go back to the <b>Add Medication</b> page.
              </>
            );
          }}
        >
          Show Toast
        </Button>
      </motion.div>
    </>
  );
};

export default ScanForm;
