import Login from "@/components/Login";

export default function Home() {
  return (
    <>
      <main>
        <h1 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
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
