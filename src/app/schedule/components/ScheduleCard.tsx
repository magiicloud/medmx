import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import DrugCard from "./DrugCard";
import { ScheduleData } from "@/types/globalTypes";
import { SunriseIcon, SunIcon, SunsetIcon, Moon } from "lucide-react";
import { auth } from "@/auth";
import { getUserDrugsAndSchedules } from "../../actions/getUserDrugsAndSchedules";
import { redirect } from "next/navigation";

const ScheduleCard = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  }
  const scheduleData = await getUserDrugsAndSchedules(
    session.user.id as string
  );
  if (!scheduleData || scheduleData.length === 0) {
    return (
      <div className="mt-32 w-screen px-10">
        <Card className="w-full opacity-60 p-4 rounded-3xl">
          <CardHeader className="justify-center pb-8 font-bold text-lg leading-loose">
            SCHEDULE
          </CardHeader>
          <CardBody className="px-3 py-0 space-y-8 pb-8">
            <p className="text-center text-default-400 text-md pt-4">
              No schedule found. Add a medication to get started.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const timeOfDay: string[] = ["morning", "afternoon", "evening", "night"];

  return (
    <div className="grid lg:grid-cols-4 gap-4 mt-32">
      {timeOfDay.map((time) => (
        <div key={time}>
          <Card className="max-w-xl opacity-80 p-4 rounded-3xl">
            <CardHeader className="justify-start gap-x-2 pb-8">
              {time === "morning" && <SunriseIcon size={24} />}
              {time === "afternoon" && <SunIcon size={24} />}
              {time === "evening" && <SunsetIcon size={24} />}
              {time === "night" && <Moon size={24} />}
              {time.toUpperCase()}
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400 space-y-8 pb-8">
              {scheduleData.map((item) => {
                if (item[time as keyof ScheduleData]) {
                  return <DrugCard key={item.id} userSchedule={item} />;
                }
              })}
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ScheduleCard;
