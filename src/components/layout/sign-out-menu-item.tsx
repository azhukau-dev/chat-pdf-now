'use client';

import { useClerk } from '@clerk/nextjs';

import { DropdownMenuItem } from '../ui/dropdown-menu';

export default function SignOutMenuItem() {
  const { signOut } = useClerk();

  return (
    <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
      Log out
    </DropdownMenuItem>
  );
}
