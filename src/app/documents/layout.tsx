import { Bot, FileText, User } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SignOutMenuItem from '@/features/layout/sign-out-menu-item';

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="shadom-sm flex flex-shrink-0 items-center border-b bg-stone-50 p-4">
        <div className="flex items-center">
          <Link href="/">
            <Bot className="size-8 transition-colors duration-200 hover:text-emerald-600" />
          </Link>
        </div>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem asChild>
                <Link href="/documents">
                  <FileText />
                  All documents
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
    </>
  );
}
