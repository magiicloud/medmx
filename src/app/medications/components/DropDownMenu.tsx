"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  ArrowDownToLineIcon,
  BookOpenTextIcon,
  EllipsisVerticalIcon,
  PillIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@nextui-org/button";
import { generateExcel } from "../util/generateExcel";
import useCustomToast from "@/components/useCustomToast";
import { RowData } from "./TableComponent";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserDrugsAndSchedules } from "@/app/actions/getUserDrugsAndSchedules";
import { revalidatePath } from "next/cache";
import { deleteUserDrug } from "@/app/actions/deleteUserDrug";

export interface DropDownMenuProps {
  item: RowData;
  rows: RowData[];
}

const MedListDropdownMenu = ({ item, rows }: DropDownMenuProps) => {
  const { displayToast } = useCustomToast();
  // const queryClient = useQueryClient();
  // const deleteUserDrug = async (userDrugId: number) => {
  //   await axios.delete(`/api/medications/userDrug/${userDrugId}`);
  // };

  // const deleteDrug = useMutation({
  //   mutationFn: deleteUserDrug,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["tableData"] });
  //     queryClient.invalidateQueries({ queryKey: ["scheduleData"] });
  //   },
  // });
  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <EllipsisVerticalIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Link Actions">
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
          </DropdownSection>
          <DropdownSection title="Actions">
            <DropdownItem
              key="download"
              startContent={<ArrowDownToLineIcon />}
              onPress={() => {
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
              onPress={async () => {
                deleteUserDrug(item.key.toString()); // Convert the number to a string
                // deleteDrug.mutate(item.key);
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
  );
};

export default MedListDropdownMenu;
