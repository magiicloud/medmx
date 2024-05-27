"use client";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AvatarMenu from "./AvatarMenu";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { MenuIcon } from "lucide-react";

export function CenterNavBar() {
  const { status } = useSession();
  if (status === "loading") return null;
  if (status === "unauthenticated") return null;
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="fixed top-10 left-5 max-w-2xl mx-auto z-50 sm:hidden">
        <DropdownItemLink />
      </div>
      <Navbar className="hidden top-6 sm:block" />
      <div className="fixed top-10 right-5 max-w-2xl mx-auto z-50 sm:right-10">
        <AvatarMenu />
      </div>
    </div>
  );
}

function DropdownItemLink() {
  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="light" isIconOnly>
          <MenuIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Small Screen Nav">
        <DropdownSection showDivider>
          <DropdownItem key="home" href="/">
            Home
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Medications" showDivider>
          <DropdownItem key="medications" href="/medications">
            My Medication List
          </DropdownItem>
          <DropdownItem key="add-medication" href="/add-medication">
            Add Medication
          </DropdownItem>
        </DropdownSection>
        <DropdownItem key="schedule" href="/schedule">
          Schedule
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div
        className={cn(
          "fixed top-10 inset-x-0 max-w-xs mx-auto z-50 lg:max-w-2xl md:max-w-md sm:max-w-sm",
          className
        )}
      >
        <Menu setActive={setActive}>
          <Link href="/">Home</Link>
          <MenuItem setActive={setActive} active={active} item="Medications">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/medications">My Medication List</HoveredLink>
              <HoveredLink href="/add-medication">Add Medication</HoveredLink>
            </div>
          </MenuItem>
          <Link href="/schedule">Schedule</Link>
        </Menu>
      </div>
    </>
  );
}
