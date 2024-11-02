import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FileQuestion className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}