// "use client";
import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
// import { useRowData } from "../util/getRowsColumns";
import MedListDropdownMenu from "./DropDownMenu";
import Counselling from "./Counselling";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { RowData } from "./TableComponent";

const DrugRowCard = ({ rows }: { rows: RowData[] }) => {
  // const { data: rowData, isLoading, error } = useRowData();
  // if (!rowData) return null;
  // const rows = rowData.map((item) => ({
  //   key: item.id,
  //   drugName: item.drug.drugName,
  //   dosingInstruction: item.dosingInstruction,
  //   auxInstruction: item.drug.auxInstruction,
  //   pil: item.drug.pilLink,
  //   drugImage: item.drug.drugImagesLink,
  //   counsellingPointsText: item.drug.counsellingPointsText,
  //   counsellingPointsVoiceLink: item.drug.counsellingPointsVoiceLink,
  //   otherResources: item.drug.otherResources,
  //   drugClass: item.drug.drugClasses.map((dc) => dc.drugClass.name),
  // }));

  // if (isLoading || !rowData)
  //   return (
  //     <div className="flex justify-center items-center h-full mt-24">
  //       <Spinner />
  //     </div>
  //   );
  // if (error) return <div>{`Error loading data ${error.message}`}</div>;

  return (
    <>
      {rows!.map((item) => (
        <Card
          className="max-w-lg p-3 opacity-100 gap-4"
          isBlurred
          key={item.key}
        >
          <CardHeader className="justify-between">
            {item.drugName}
            <div className="ml-auto px-1 space-x-1 text-end text-default-400 text-small">
              {item.drugClass.map((dc, index) => (
                <Chip
                  key={index}
                  size="sm"
                  className="my-1"
                  variant="shadow"
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                    content: "drop-shadow shadow-black text-white",
                  }}
                >
                  {dc}
                </Chip>
              ))}
            </div>
            <MedListDropdownMenu item={item} rows={rows} />
          </CardHeader>

          <CardBody className="px-3 py-0 text-small text-default-400">
            <p className="mb-4">{item.dosingInstruction}</p>
            <p className="text-default-400 text-small">{item.auxInstruction}</p>
          </CardBody>
          <Divider className="mt-8" />
          <CardFooter className="gap-3 ">
            <Counselling item={item} />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default DrugRowCard;
