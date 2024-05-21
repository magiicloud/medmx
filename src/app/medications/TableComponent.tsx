"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import Image from "next/image";
import {
  ArrowDownToLineIcon,
  AudioLinesIcon,
  BookOpenTextIcon,
  EllipsisVerticalIcon,
  PillIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useCustomToast from "@/components/useCustomToast";
import { Spinner } from "@nextui-org/spinner";
import { generateExcel } from "./generateExcel";

interface RowData {
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

const TableComponent = ({
  columns,
  rows,
}: {
  columns: {
    key: string;
    label: string;
  }[];
  rows: RowData[] | [];
}) => {
  const deleteUserDrug = async (userDrugId: number) => {
    await axios.delete(`/api/medications/userDrug/${userDrugId}`);
  };

  const deleteDrug = useMutation({
    mutationFn: deleteUserDrug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drugs"] });
    },
  });
  const queryClient = useQueryClient();
  const { displayToast } = useCustomToast();
  const [playingRow, setPlayingRow] = useState<number | null>(null);
  const [audioUrls, setAudioUrls] = useState<{ [key: number]: string }>({});

  const textToSpeech = useMutation({
    mutationFn: async ({
      speechString,
      fileNameString,
    }: {
      speechString: string;
      fileNameString: string;
      rowKey: number;
    }) => {
      const response = await axios.post("/api/medications/textSpeech", {
        speechString,
        fileNameString,
      });
      return response.data.tts;
    },
    onSuccess: (audioContent, { rowKey }) => {
      const audioUrl = `data:audio/mp3;base64,${audioContent}`;
      setAudioUrls((prev) => ({
        ...prev,
        [rowKey]: audioUrl,
      }));
      queryClient.invalidateQueries({ queryKey: ["tts"] });
    },
  });

  const handlePlayAudio = (item: RowData) => {
    setPlayingRow(item.key);

    if (audioUrls[item.key]) {
      // Use cached audio URL if available
      setPlayingRow(item.key);
    } else {
      // Fetch audio from API and cache it
      textToSpeech.mutate({
        speechString: item.counsellingPointsText,
        fileNameString: item.drugName,
        rowKey: item.key,
      });
    }
  };

  return (
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
              <div className="flex items-center space-x-3">
                <Tooltip
                  size="sm"
                  color="secondary"
                  placement="bottom"
                  showArrow={true}
                  content="Click to listen to counselling points"
                >
                  <Button
                    isIconOnly
                    variant="light"
                    onClick={() => handlePlayAudio(item)}
                  >
                    {textToSpeech.isPending && playingRow === item.key ? (
                      <Spinner />
                    ) : (
                      <AudioLinesIcon />
                    )}
                  </Button>
                </Tooltip>
                {playingRow === item.key && audioUrls[item.key] && (
                  <audio
                    controls
                    controlsList="nodownload"
                    className="max-w-96 pr-3 h-8"
                    autoPlay
                  >
                    <source src={audioUrls[item.key]} type="audio/mp3" />
                  </audio>
                )}
              </div>
              <p className="pt-3 mb-3">{item.counsellingPointsText}</p>
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
                          generateExcel(rows);
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

export default TableComponent;
