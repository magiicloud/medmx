import { getAllDrugs } from "../actions/getAllDrugs";
import AddMedsTab from "./components/AddMedsTab";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const AddMedication = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["medications"],
    queryFn: getAllDrugs,
  });
  return (
    <>
      <div className="mx-20 pt-32 w-screen px-6 md:pt-0 grid md:grid-cols-2 md:gap-x-12">
        <div className="flex flex-col justify-center items-center mb-10 md:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center pb-6">
            Add Medication
          </h1>
          <p className="text-base md:text-md lg:text-xl text-center">
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
