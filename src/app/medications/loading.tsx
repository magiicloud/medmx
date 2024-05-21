import { Skeleton } from "@nextui-org/skeleton";

const Loading = () => {
  const skeletonRows = Array.from({ length: 5 }).map((_, index) => (
    <Skeleton key={index} className="h-16 w-full rounded-lg opacity-70" />
  ));

  return (
    <div className="m-6 pt-24 w-screen p-12 space-y-3">
      <Skeleton className="h-8 w-full rounded-lg opacity-90" />
      {skeletonRows}
    </div>
  );
};

export default Loading;
