import { ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function WelcomeCard() {
  return (
    <Card className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border-0 bg-white/80 text-center shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-600">
          <Bot className="size-8 text-white" />
        </div>
        <CardTitle className="text-4xl leading-tight font-black tracking-tight text-emerald-700">
          Chat PDF Now
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Transform your PDF documents into interactive conversations. Upload,
          chat, and discover insights instantly.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="text-base">🤖</span>
            <span>AI-powered conversations</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="text-base">⚡</span>
            <span>Instant document analysis</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="text-base">🔒</span>
            <span>Secure and private</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          size="lg"
          className="w-full bg-emerald-600 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-emerald-700 hover:shadow-xl"
        >
          <Link href="/documents" prefetch={false}>
            Get Started <ArrowRight className="ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
