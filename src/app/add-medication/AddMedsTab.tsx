"use client";
import React, { Suspense, useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import ManualForm from "./ManualForm";
import ScanForm from "./ScanForm";
import Loading from "./loading";

const AddMedsTab = () => {
  const [tab, setTab] = useState("scan");

  return (
    <div className="flex flex-col space-y-4 md:justify-center">
      <Tabs
        fullWidth
        size="md"
        aria-label="Tabs form"
        selectedKey={tab}
        onSelectionChange={(key) => setTab(key.toString())}
      >
        <Tab key="scan" title="Scan">
          <Suspense fallback={<Loading />}>
            <ScanForm />
          </Suspense>
        </Tab>
        <Tab key="manual" title="Manual">
          <ManualForm />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AddMedsTab;
