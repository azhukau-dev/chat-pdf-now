import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { Bot, User } from 'lucide-react';
import Link from 'next/link';

import SignOutMenuItem from '@/components/sign-out-menu-item';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="shadom-sm flex items-center border-b bg-white/80 p-4 backdrop-blur-sm">
        <div className="flex items-center">
          <Link href="/">
            <Bot className="size-8 transition-colors duration-200 hover:text-emerald-600" />
          </Link>
        </div>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <SignOutMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
