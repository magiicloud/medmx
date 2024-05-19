import Login from "@/components/Login";

export default function Home() {
  return (
    <>
      <main className="flex flex-col justify-center items-center h-screen p-3">
        <h1 className="text-4xl md:text-5xl lg:text-7xl text-white font-bold inter-var text-center">
          MedMx
        </h1>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
          Leverage the power of canvas to create a beautiful hero section
        </p>
        <Login />
      </main>
    </>
  );
}
