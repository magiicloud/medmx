"use client";
import React, { Suspense, useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import ManualForm from "./ManualForm";
import ScanForm from "./ScanForm";
import Loading from "./loading";
import { Card, CardBody } from "@nextui-org/card";

const AddMedsTab = () => {
  const [tab, setTab] = useState("scan");

  return (
    <div className="flex flex-col space-y-4 md:justify-center ">
      <Card className="p-3 opacity-80">
        <CardBody className="p-3">
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
        </CardBody>
      </Card>
    </div>
  );
};

export default AddMedsTab;
