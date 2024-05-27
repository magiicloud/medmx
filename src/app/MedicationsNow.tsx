import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { ScheduleData } from "@/types/globalTypes";
import { SunriseIcon, SunIcon, SunsetIcon, Moon } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserDrugsAndSchedules } from "./actions/getUserDrugsAndSchedules";
import DrugCard from "./schedule/components/DrugCard";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MotionDiv } from "@/components/MotionDiv";

const MedicationsNow = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  }
  const scheduleData = await getUserDrugsAndSchedules(
    session.user.id as string
  );
  if (!scheduleData) {
    return null;
  }

  // Determine the current time of day in Singapore
  const currentHour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Singapore",
    }).format(new Date())
  );

  let currentTimeOfDay = "";

  if (currentHour >= 6 && currentHour < 12) {
    currentTimeOfDay = "morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    currentTimeOfDay = "afternoon";
  } else if (currentHour >= 18 && currentHour < 24) {
    currentTimeOfDay = "evening";
  } else {
    currentTimeOfDay = "night";
  }

  // Filter medications for the current time of day
  const medicationsForCurrentTime = scheduleData.filter(
    (item) => item[currentTimeOfDay as keyof ScheduleData]
  );

  return (
    <MotionDiv>
      <div className="grid lg:grid-cols-1 gap-4">
        <div key={currentTimeOfDay}>
          <Card className="max-w-xl opacity-80 p-4 rounded-3xl max-h-[560px] overflow-auto md:max-h-[640px] lg:max-h-[740px]">
            <CardHeader className="flex flex-col justify-start gap-x-2 pb-8">
              {currentTimeOfDay === "morning" && <SunriseIcon size={36} />}
              {currentTimeOfDay === "afternoon" && <SunIcon size={36} />}
              {currentTimeOfDay === "evening" && <SunsetIcon size={36} />}
              {currentTimeOfDay === "night" && <Moon size={36} />}
              <TextGenerateEffect
                words={`Good ${currentTimeOfDay.toLowerCase()}, ${
                  session.user.name
                }. These are your ${currentTimeOfDay.toLowerCase()} medications.`}
                className="p-3 text-md lg:text-lg"
              />
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400 space-y-8 pb-8">
              {medicationsForCurrentTime.length === 0 ? (
                <div className="text-center text-md lg:text-lg">
                  You have no medications scheduled for this time of day.
                </div>
              ) : (
                medicationsForCurrentTime.map((item) => (
                  <DrugCard key={item.id} userSchedule={item} />
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </MotionDiv>
  );
};

export default MedicationsNow;
