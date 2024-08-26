import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipLoader } from 'react-spinners'; // Optional: Use if you need a loading state
import { Download } from 'lucide-react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: any;
  isLoading?: boolean; // Optional: Add loading state if needed
  collection_url?: string;
}

export function JsonModal({ isOpen, onClose, jsonData, isLoading = false, collection_url }: JsonModalProps) {
  // Optional: Log the collection_url for debugging purposes
  console.log(collection_url);

  // Ensure the Dialog component receives the correct props
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>API Response</DialogTitle>
          <DialogDescription>
            View the JSON response from the API call.
          </DialogDescription>
          <Button className='w-full'
                     onClick={() => {window.open(collection_url, '_blank');}}
                   >
                     Download  <Download className="ml-3"/>
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
