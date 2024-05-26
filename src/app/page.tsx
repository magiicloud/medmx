import Login from "@/components/Login";
import MedicationsNow from "./MedicationsNow";
import { MotionDiv } from "@/components/MotionDiv";
import { auth } from "@/auth";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default async function Home() {
  const session = await auth();

  return (
    <>
      {session ? (
        <main className="min-h-screen mx-10 max-w-screen-2xl pt-32 md:pt-0 grid md:grid-cols-2 md:gap-x-12">
          <div className="flex flex-col justify-center items-center p-3">
            <h1 className="text-4xl md:text-5xl lg:text-7xl text-white font-bold inter-var text-center">
              MedMx
            </h1>
            <p className="text-base md:text-2xl mt-4 text-white font-normal inter-var text-center">
              Snap, Recognize, Manage - Your Medication Simplified
            </p>
            <Login />
          </div>
          <div className="flex flex-col space-y-4 md:justify-center">
            <MedicationsNow />
          </div>
        </main>
      ) : (
        <main className="flex flex-col justify-center items-center h-screen p-3">
          <h1 className="text-4xl md:text-5xl lg:text-7xl text-white font-bold inter-var text-center">
            MedMx
          </h1>
          <TextGenerateEffect
            words="Snap, Recognize, Manage - Your Medication Simplified"
            className="text-base md:text-2xl mt-4 text-white font-normal inter-var text-center"
          />
          {/* <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
            Snap, Recognize, Manage - Your Medication Simplified
          </p> */}
          <Login />
        </main>
      )}
    </>
  );
}
