"use client";
import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import DrugCard from "./DrugCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ScheduleData } from "@/types/globalTypes";
import { useSession } from "next-auth/react";
import { SunriseIcon, SunIcon, SunsetIcon, Moon } from "lucide-react";

const ScheduleCard = () => {
  const timeOfDay: string[] = ["morning", "afternoon", "evening", "night"];

  const { data: session } = useSession();

  const fetchUserSchedule = async () => {
    const { data } = await axios.get<ScheduleData[]>(
      `/api/schedule/${session!.user!.id}`
    );
    return data;
  };

  const {
    data: scheduleData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchUserSchedule,
  });

  if (!scheduleData || isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
