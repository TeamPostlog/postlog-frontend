import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipLoader } from 'react-spinners';
import { Download } from 'lucide-react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: any;
  isLoading?: boolean;
  collection_url?: string;
}

export function JsonModal({
  isOpen,
  onClose,
  jsonData,
  isLoading = false,
  collection_url
}: JsonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <span>API Response</span>
            </div>
          </DialogTitle>
          <DialogDescription>View the JSON response from the API call.</DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(collection_url, '_blank')}
          >
            <Download className="h-5 w-5" />
            Download
          </Button>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader size={60} color="#000000" />
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-md">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
