import React from "react";
import ScheduleCard from "./components/ScheduleCard";
import { MotionDiv } from "@/components/MotionDiv";

const Schedule = () => {
  return (
    <div>
      <MotionDiv>
        <ScheduleCard />
      </MotionDiv>
    </div>
  );
};

export default Schedule;
