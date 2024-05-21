import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { ScheduleData } from "@/types/globalTypes";
import { Chip } from "@nextui-org/chip";

interface Props {
  userSchedule: ScheduleData;
}

const DrugCard: React.FC<Props> = ({ userSchedule }) => {
  return (
    <div>
      <Card className="max-w-lg opacity-100">
        <CardHeader className="justify-between">
          {userSchedule.userDrug.drug.drugName}
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <p>{userSchedule.userDrug.dosingInstruction}</p>
        </CardBody>
        <CardFooter className="gap-3">
          <div className="flex gap-1">
            <p className="text-default-400 text-small">
              {userSchedule.userDrug.drug.auxInstruction}
            </p>
          </div>
          <div className="flex gap-1">
            <div className="space-y-1 text-end text-default-400 text-small">
              {userSchedule.userDrug.drug.drugClasses.map((drug, index) => {
                return (
                  <Chip
                    key={index}
                    variant="shadow"
                    classNames={{
                      base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                      content: "drop-shadow shadow-black text-white",
                    }}
                  >
                    {drug.drugClass.name}
                  </Chip>
                );
              })}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DrugCard;
