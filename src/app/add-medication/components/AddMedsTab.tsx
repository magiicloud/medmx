"use client";
import React, { Suspense, useState } from "react";
// import { Tabs, Tab } from "@nextui-org/tabs";
import ManualForm from "./ManualForm";
import ScanForm from "./ScanForm";
import Loading from "../loading";
import { Card, CardBody } from "@nextui-org/card";
import { Tabs } from "@/components/ui/animatedtabs";

const AddMedsTab = () => {
  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-full mx-auto w-full items-start justify-start md:my-40">
      <Tabs
        tabs={[
          {
            title: "Scan",
            value: "scan",
            content: (
              <Card className="p-3">
                <CardBody className="p-3">
                  <ScanForm />
                </CardBody>
              </Card>
            ),
          },
          {
            title: "Manual",
            value: "manual",
            content: (
              <Card className="p-3">
                <CardBody className="p-3">
                  <ManualForm />
                </CardBody>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AddMedsTab;
