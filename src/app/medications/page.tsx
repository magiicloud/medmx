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
import { DrugData } from "@/types/globalTypes";

const fetchDrugs = async (): Promise<DrugData[]> => {
  const { data } = await axios.get<DrugData[]>("/api/medications");
  return data;
};

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

const MedList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["drugs"],
    queryFn: fetchDrugs,
  });
  if (isLoading) return <div>Loading...</div>;
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
    <Table aria-label="medList">
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
                PIL
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

export default MedList;
