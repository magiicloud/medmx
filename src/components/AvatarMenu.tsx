"Use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { useSession } from "next-auth/react";

const AvatarMenu = () => {
  const { data: session } = useSession();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={session! && session.user!.name!}
          size="sm"
          src={session! && session.user!.image!}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          key="profile"
          className="h-14 gap-2"
          textValue="signedInAs"
        >
          <p>Signed in as</p>
          <p className="font-semibold">{session && session.user!.email}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" href="/api/auth/signout">
          {/* {status === "authenticated" && (
              <Link href="/api/auth/signout">Sign Out</Link>
            )} */}
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AvatarMenu;
