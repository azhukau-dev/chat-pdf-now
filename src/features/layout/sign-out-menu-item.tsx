'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function SignOutMenuItem() {
  const { signOut } = useClerk();

  return (
    <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
      <LogOut /> Sign out
    </DropdownMenuItem>
  );
}
