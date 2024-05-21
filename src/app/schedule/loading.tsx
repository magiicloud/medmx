import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="grid lg:grid-cols-4 gap-4 mt-32">
      {["morning", "afternoon", "evening", "night"].map((time) => (
        <div key={time}>
          <Card className="h-72 w-64 opacity-80 p-4 rounded-3xl gap-y-4">
            <Skeleton className="rounded-lg">
              <CardHeader className="justify-start gap-x-2 pb-8"></CardHeader>
            </Skeleton>
            <Skeleton className="rounded-lg h-full">
              <CardBody className="px-3 py-0 text-small text-default-400 space-y-8 pb-8"></CardBody>
            </Skeleton>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Loading;
