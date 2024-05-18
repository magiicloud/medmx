"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import Image from "next/image";
import { Skeleton } from "@nextui-org/skeleton";
import { UserDrugData } from "@/types/globalTypes";
import { BookOpenTextIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/auth";

const columns = [
  {
    key: "drugName",
    label: "Medication Name",
  },
  {
    key: "dosingInstruction",
    label: "Dosing Instruction",
  },
  {
    key: "counsellingPointsText",
    label: "Counselling Points",
  },
  {
    key: "pil",
    label: "Information Leaflet",
  },
  {
    key: "drugImage",
    label: "Drug Image",
  },
  {
    key: "otherResources",
    label: "Other Resources",
  },
];

const MedListTable = () => {
  const { data: session } = useSession();
  const customSession = session as CustomSession | null;

  const fetchDrugs = async (): Promise<UserDrugData[]> => {
    const { data } = await axios.get<UserDrugData[]>(
      `/api/medications/user/${customSession!.userId}`
    );
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["drugs"],
    queryFn: fetchDrugs,
  });

  if (isLoading)
    return (
      <Table aria-label="medList-skeleton">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>
              <Skeleton className="h-10 w-1/2 rounded-lg" />
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Skeleton className="h-8 w-full rounded-lg" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  if (error) return <div>Error: {error.message}</div>;

  const rows = data
    ? data.map((item) => ({
        key: item.id,
        drugName: item.drug.drugName,
        dosingInstruction: item.dosingInstruction,
        auxInstruction: item.drug.auxInstruction,
        pil: item.drug.pilLink,
        drugImage: item.drug.drugImagesLink,
        counsellingPointsText: item.drug.counsellingPointsText,
        counsellingPointsVoiceLink: item.drug.counsellingPointsVoiceLink,
        otherResources: item.drug.otherResources,
        drugClass: item.drug.drugClasses.map((dc) => dc.drugClass.name),
      }))
    : [];

  return (
    <Table aria-label="medList" className="opacity-90">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((item) => (
          <TableRow key={item.key}>
            <TableCell>{item.drugName}</TableCell>
            <TableCell>
              <p>{item.dosingInstruction}</p>
              <p>{item.auxInstruction}</p>
            </TableCell>
            <TableCell>
              <audio controls className="pb-3">
                <source
                  src={item.counsellingPointsVoiceLink}
                  type="audio/mpeg"
                />
              </audio>
              <p>{item.counsellingPointsText}</p>
            </TableCell>
            <TableCell>
              <a href={item.pil} target="_blank" rel="noopener noreferrer">
                <BookOpenTextIcon />
              </a>
            </TableCell>
            <TableCell>
              <a
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
              </a>
            </TableCell>

            <TableCell>
              <a
                href={item.otherResources}
                target="_blank"
                rel="noopener noreferrer"
              >
                Other Resources
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MedListTable;
