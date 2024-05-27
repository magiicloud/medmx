import TableComponent from "./components/TableComponent";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/spinner";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { columns, getRows } from "./util/getRowsColumns";
import { auth } from "@/auth";
import Loading from "./loading";

export const MedListTable = async () => {
  // const session = await auth();
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["tableData"],
  //   queryFn: () => getRows(session!.user!.id as string),
  // });
  const rowData = await getRows();
  if (!rowData) return null;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full mt-24">
          <Loading />
        </div>
      }
    >
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <TableComponent rows={rowData} />
      {/* </HydrationBoundary> */}
    </Suspense>
  );
};
