// "use client";
import { auth } from "@/auth";
import axios from "axios";
import { UserDrugData } from "@/types/globalTypes";
import { useSession } from "next-auth/react";
import { RowData } from "../components/TableComponent";
import { useQuery } from "@tanstack/react-query";
import { getUserDrugsByUserId } from "@/app/actions/getUserDrugsByUserId";
import { revalidatePath } from "next/cache";

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

export const getRows = async (): Promise<RowData[] | null> => {
  const session = await auth();
  if (!session || !session.user) {
    return null;
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
    drugClass: item.drug.drugClasses.map((dc) => dc.drugClass.name),
  }));
  revalidatePath("/medications");
  return rowData;
};

// export const getRows = async (userId: string): Promise<UserDrugData[]> => {
//   console.log(`Fetching user drugs for user ID: ${userId}`);
//   const response = await axios.get(`/api/medications/user/${userId}`);
//   return response.data;
// };

// export const useRowData = () => {
//   const { data: session } = useSession();
//   return useQuery({
//     queryKey: ["tableData", session?.user?.id],
//     queryFn: () => getRows(session!.user!.id as string),
//     enabled: !!session?.user?.id, // Ensure the query only runs when the user ID is available
//   });
// };
