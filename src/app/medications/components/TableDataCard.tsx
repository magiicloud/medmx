import React, { Suspense } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import DrugRowCard from "./DrugCard";
import { Spinner } from "@nextui-org/spinner";
import { getRows } from "../util/getRowsColumns";

const TableDataCard = async () => {
  const rowData = await getRows();
  if (!rowData) return null;
  return (
    <div className="flex flex-col items-center gap-4 w-screen p-4 md:p-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full mt-24">
            <Spinner />
          </div>
        }
      >
        <Card className="max-w-xl opacity-80 p-4 rounded-3xl">
          <CardHeader className=" justify-center">
            <p className="text-center font-bold">Medication List</p>
          </CardHeader>
          <CardBody className="p-3 text-small text-default-400 space-y-8 pb-8">
            {rowData.length === 0 ? (
              <p className="text-center text-md lg:text-lg">
                You have no medications in your medication list.
              </p>
            ) : (
              <DrugRowCard rows={rowData} />
            )}
          </CardBody>
        </Card>
      </Suspense>
    </div>
  );
};

export default TableDataCard;
