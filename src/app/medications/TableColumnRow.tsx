import { getUserDrugsByUserId } from "@/app/api/medications/user/[userId]/route";
import { auth } from "@/auth";
import TableComponent from "./TableComponent";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/spinner";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const columns = [
  {
    key: "drugName",
    label: "Medication Name",
  },
  {
    key: "dosingInstruction",
    label: "Dose Instruction",
  },
  {
    key: "auxInstruction",
    label: "Special Instruction",
  },
  {
    key: "counsellingPointsText",
    label: "Counselling Points",
  },
  {
    key: "drugImage",
    label: "Drug Image",
  },
  {
    key: "action",
    label: "Action",
  },
];

export const getRows = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  }

  const userDrugs = await getUserDrugsByUserId(session.user.id as string);
  if (!userDrugs) {
    return null;
  }

  const rowData = userDrugs.map((item) => ({
    key: item.id,
    drugName: item.drug.drugName,
    dosingInstruction: item.dosingInstruction,
    auxInstruction: item.drug.auxInstruction,
    pil: item.drug.pilLink,
    drugImage: item.drug.drugImagesLink,
    counsellingPointsText: item.drug.counsellingPointsText,
    counsellingPointsVoiceLink: item.drug.counsellingPointsVoiceLink,
    otherResources: item.drug.otherResources,
    drugClass: item.drug.drugClasses.map((dc) => dc.drugClass.name),
  }));

  return rowData;
};

export const MedListTable = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tableData"],
    queryFn: getRows,
  });

  const rows = await getRows();
  if (!rows) return [];

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full mt-24">
          <Spinner />
        </div>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TableComponent columns={columns} rows={rows} />
      </HydrationBoundary>
    </Suspense>
  );
};
