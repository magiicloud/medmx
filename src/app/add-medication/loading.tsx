import { Spinner } from "@nextui-org/spinner";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Spinner size="lg" />
    </div>
  );
};

export default Loading;
