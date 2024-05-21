import React from "react";
import AddMedsTab from "./AddMedsTab";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllDrugs } from "../api/medications/route";

const AddMedication = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["medications"],
    queryFn: getAllDrugs,
  });
  return (
    <>
      <div className="min-h-screen mx-10 max-w-screen-2xl pt-32 md:pt-0 grid md:grid-cols-2 md:gap-x-12">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-center pb-6">
            Add Medication
          </h1>
          <p className="text-sm text-center">
            You can upload an image of the drug label to extract the medication
            name and dosing instructions
          </p>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AddMedsTab />
        </HydrationBoundary>
      </div>
    </>
  );
};

export default AddMedication;
