"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  ArrowDownToLineIcon,
  BookOpenTextIcon,
  EllipsisVerticalIcon,
  LibraryIcon,
  PillIcon,
  Trash2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import useCustomToast from "@/components/useCustomToast";

const columns = [
  {
    key: "drugName",
    label: "Medication Name",
  },
  {
    key: "dosingInstruction",
    label: "Dose Instruction",
  },
  {
    key: "auxInstruction",
    label: "Special Instruction",
  },
  {
    key: "counsellingPointsText",
    label: "Counselling Points",
  },
  {
    key: "drugImage",
    label: "Drug Image",
  },
  {
    key: "action",
    label: "Action",
  },
];

const MedListTable = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { displayToast } = useCustomToast();

  const fetchDrugs = async (): Promise<UserDrugData[]> => {
    const { data } = await axios.get<UserDrugData[]>(
      `/api/medications/user/${session!.user!.id}`
    );
    return data;
  };

  const deleteUserDrug = async (userDrugId: number) => {
    await axios.delete(`/api/medications/userDrug/${userDrugId}`);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["drugs"],
    queryFn: fetchDrugs,
  });

  const deleteDrug = useMutation({
    mutationFn: deleteUserDrug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drugs"] });
    },
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
    <Table aria-label="medList" className="opacity-90 w-screen p-6">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={"No medications to display."}>
        {rows.map((item) => (
          <TableRow key={item.key}>
            <TableCell>{item.drugName}</TableCell>
            <TableCell>
              <p>{item.dosingInstruction}</p>
            </TableCell>
            <TableCell>
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
              <div className="relative flex justify-end items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <EllipsisVerticalIcon className="text-default-300" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Link Actions"
                    disabledKeys={["disabledOtherResources", "test"]}
                  >
                    <DropdownSection title="Additional Information" showDivider>
                      <DropdownItem
                        key="image"
                        href={item.drugImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        startContent={<PillIcon />}
                      >
                        Medication Image
                      </DropdownItem>
                      <DropdownItem
                        key="pil"
                        href={item.pil}
                        target="_blank"
                        rel="noopener noreferrer"
                        startContent={<BookOpenTextIcon />}
                      >
                        Medication Leaflet
                      </DropdownItem>
                      {/* {item.otherResources ? (
                        <DropdownItem
                          key="otherResources"
                          href={item.otherResources}
                          target="_blank"
                          rel="noopener noreferrer"
                          startContent={<LibraryIcon />}
                        >
                          Other Resources
                        </DropdownItem>
                      ) : (
                        <DropdownItem key="disabledOtherResources"></DropdownItem>
                      )} */}
                    </DropdownSection>
                    <DropdownSection title="Actions">
                      <DropdownItem
                        key="download"
                        startContent={<ArrowDownToLineIcon />}
                        onClick={() => {
                          console.log("download");
                          displayToast(
                            "default",
                            undefined,
                            "Downloading medication list..."
                          );
                        }}
                      >
                        Download Medication List
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash2Icon />}
                        onClick={() => {
                          deleteDrug.mutate(item.key);
                          displayToast(
                            "destructive",
                            undefined,
                            "Medication deleted successfully"
                          );
                        }}
                      >
                        Delete Medication
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MedListTable;
