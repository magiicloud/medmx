import { getUserDrugsByUserId } from "@/app/api/medications/user/[userId]/route";
import { auth } from "@/auth";
import TableTest from "./TableComponent";
import { redirect } from "next/navigation";

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
  const rows = await getRows();
  return <TableTest columns={columns} rows={rows} />;
};
