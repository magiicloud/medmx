import React from "react";
import { MedListTable } from "./MedListTable";
import TableDataCard from "./components/TableDataCard";

const MedList = async () => {
  return (
    <>
      <div className="m-6 pt-24 hidden lg:block">
        <MedListTable />
      </div>
      <div className="pt-24 lg:hidden">
        <TableDataCard />
      </div>
    </>
  );
};

export default MedList;
