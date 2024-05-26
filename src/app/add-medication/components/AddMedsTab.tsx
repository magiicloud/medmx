"use client";
import React, { Suspense, useState } from "react";
// import { Tabs, Tab } from "@nextui-org/tabs";
import ManualForm from "./ManualForm";
import ScanForm from "./ScanForm";
import Loading from "../loading";
import { Card, CardBody } from "@nextui-org/card";
import { Tabs } from "@/components/ui/animatedtabs";

const AddMedsTab = () => {
  // const [tab, setTab] = useState("scan");

  return (
    // <div className="flex flex-col space-y-4 md:justify-center ">
    //   <Card className="p-3 opacity-80">
    //     <CardBody className="p-3">
    //       <Tabs
    //         fullWidth
    //         size="md"
    //         aria-label="Tabs form"
    //         selectedKey={tab}
    //         onSelectionChange={(key) => setTab(key.toString())}
    //       >
    //         <Tab key="scan" title="Scan">
    //           <Suspense fallback={<Loading />}>
    //             <ScanForm />
    //           </Suspense>
    //         </Tab>
    //         <Tab key="manual" title="Manual">
    //           <ManualForm />
    //         </Tab>
    //       </Tabs>
    //     </CardBody>
    //   </Card>
    // </div>
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start md:my-40">
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
