import React, { Suspense } from "react";
// import MedListTable from "./MedListTable";
import { MedListTable } from "./TableColumnRow";

const MedList = async () => {
  return (
    <div className="m-6 pt-24">
      <MedListTable />
    </div>
  );
};

export default MedList;
