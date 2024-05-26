"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MedListDropdownMenu from "./DropDownMenu";
import Counselling from "./Counselling";
import { columns } from "../util/getRowsColumns";
// import { columns, useRowData } from "../util/getRowsColumns";
// import { Spinner } from "@nextui-org/spinner";

export interface RowData {
  key: number;
  drugName: string;
  dosingInstruction: string;
  auxInstruction: string;
  pil: string;
  drugImage: string;
  counsellingPointsText: string;
  counsellingPointsVoiceLink: string;
  otherResources: string | null;
  drugClass: string[];
}

const TableComponent = ({ rows }: { rows: RowData[] }) => {
  // const { data: rowData, isLoading, error } = useRowData();
  // if (!rowData) return null;
  // const rows = rowData.map((item) => ({
  //   key: item.id,
  //   drugName: item.drug.drugName,
  //   dosingInstruction: item.dosingInstruction,
  //   auxInstruction: item.drug.auxInstruction,
  //   pil: item.drug.pilLink,
  //   drugImage: item.drug.drugImagesLink,
  //   counsellingPointsText: item.drug.counsellingPointsText,
  //   counsellingPointsVoiceLink: item.drug.counsellingPointsVoiceLink,
  //   otherResources: item.drug.otherResources,
  //   drugClass: item.drug.drugClasses.map((dc) => dc.drugClass.name),
  // }));

  // if (isLoading || !rowData)
  //   return (
  //     <div className="flex justify-center items-center h-full mt-24">
  //       <Spinner />
  //     </div>
  //   );
  // if (error) return <div>{`Error loading data ${error.message}`}</div>;
  return (
    rows && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Table aria-label="medList" className="opacity-90 w-screen p-6">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent={"No medications to display."}>
            {rows!.map((item) => (
              <TableRow key={item.key}>
                <TableCell>{item.drugName}</TableCell>
                <TableCell>
                  <p>{item.dosingInstruction}</p>
                </TableCell>
                <TableCell>
                  <p>{item.auxInstruction}</p>
                </TableCell>
                <TableCell>
                  <Counselling item={item} />
                </TableCell>
                <TableCell>
                  <Link
                    href={item.drugImage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={"https://picsum.photos/seed/picsum/100"}
                      width={100}
                      height={100}
                      alt={item.drugName}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <MedListDropdownMenu item={item} rows={rows} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    )
  );
};

export default TableComponent;
