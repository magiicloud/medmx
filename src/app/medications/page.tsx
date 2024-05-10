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

interface DrugData {
  id: number;
  drugName: string;
  pilLink: string;
  drugImagesLink: string;
  counsellingPointsText: string;
  counsellingPointsVoiceLink: string;
  otherResources: string;
  acute: boolean;
  chronic: boolean;
}

const fetchDrugs = async (): Promise<DrugData[]> => {
  const { data } = await axios.get<DrugData[]>("/api/medications");
  return data;
};

const columns = [
  {
    key: "drugName",
    label: "Drug Name",
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
    key: "counsellingPointsVoiceLink",
    label: "Listen",
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
    ? data.map((drug) => ({
        key: drug.id,
        drugName: drug.drugName,
        pil: drug.pilLink,
        drugImage: drug.drugImagesLink,
        counsellingPointsText: drug.counsellingPointsText,
        counsellingPointsVoiceLink: drug.counsellingPointsVoiceLink,
        otherResources: drug.otherResources,
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
                Image
              </a>
            </TableCell>
            <TableCell>
              <a
                href={item.counsellingPointsVoiceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen
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
