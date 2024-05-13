"use client";
import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import ManualForm from "./ManualForm";
import ScanForm from "./ScanForm";

const AddMedication = () => {
  const [tab, setTab] = useState("scan");

  return (
    <>
      <div className="min-h-screen mx-10 max-w-screen-2xl grid md:grid-cols-2 md:gap-x-12">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-center pb-6">
            Add Medication
          </h1>
          <p className="text-sm text-center">
            You can upload an image of the drug label to extract the medication
            name and dosing instructions
          </p>
        </div>
        <div className="flex flex-col space-y-4 md:justify-center">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={tab}
            onSelectionChange={(key) => setTab(key.toString())}
          >
            <Tab key="scan" title="Scan">
              <ScanForm />
            </Tab>
            <Tab key="manual" title="Manual">
              <ManualForm />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AddMedication;
