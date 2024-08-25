import React, { useState, useEffect, SVGProps } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming this is your custom Checkbox component
import Cookies from 'js-cookie';

// Type definition for the structure of the files
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

// Props for the FileSelectorModal component
interface FileSelectorModalProps {
  username: string;
  organisation: string;
  repo: string;
  branch: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedFiles: { filepaths: string[] }, repo_name: string, repo_branch: string) => void;
}

export function FileSelectorModal({
  username,
  organisation,
  repo,
  branch,
  isOpen,
  onClose,
  onSubmit
}: FileSelectorModalProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      const accessToken = Cookies.get("access_token");
      if (organisation===username){
        fetch(`https://api.postlog.gethiroscope.com/repo/fetch_repo_files/${repo}/${branch}`, {
          headers: {
            'x-access-tokens': `${accessToken}` // Include the access token in the headers
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log('Fetched data:', data);
            const hierarchicalFiles = buildFileHierarchy(data.files);
            setFiles(hierarchicalFiles);
          })
          .catch(error => {
            console.error('Error fetching files:', error);
          });

      } else {
        fetch(`https://api.postlog.gethiroscope.com/repo/fetch_repo_files/${organisation}/${repo}/${branch}`, {
          headers: {
            'x-access-tokens': `${accessToken}` // Include the access token in the headers
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log('Fetched data:', data);
            const hierarchicalFiles = buildFileHierarchy(data.files);
            setFiles(hierarchicalFiles);
          })
          .catch(error => {
            console.error('Error fetching files:', error);
          });
      }
    }
  }, [isOpen, repo, branch]);

  useEffect(() => {
    if (files.length > 0) {
      const initialState: { [key: string]: boolean } = {};
      files.forEach((file) => {
        const fullPath = file.name;
        if (file.type === 'folder' && file.children) {
          file.children.forEach((child) => {
            initialState[`${fullPath}/${child.name}`] = false;
          });
        } else {
          initialState[fullPath] = false;
        }
      });
      setIsChecked(initialState);
    }
  }, [files]);

  useEffect(() => {
    const newSelectedFiles = Object.keys(isChecked).filter((fullPath) => isChecked[fullPath]);
    setSelectedFiles(newSelectedFiles);
  }, [isChecked]);

  // This function converts a flat list of file paths into a hierarchical structure
  function buildFileHierarchy(fileList: string[]): FileNode[] {
    const root: FileNode[] = [];
    fileList.forEach(filepath => {
      const parts = filepath.split('/');
      let currentLevel = root;
      parts.forEach((part, index) => {
        let node = currentLevel.find(node => node.name === part);
        if (!node) {
          node = {
            name: part,
            type: index === parts.length - 1 ? 'file' : 'folder',
            children: []
          };
          currentLevel.push(node);
        }
        if (node.type === 'folder' && node.children) {
          currentLevel = node.children;
        }
      });
    });
    return root;
  }

  function handleFolderToggle(folderName: string) {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  }

  function handleCheckboxChange(fullPath: string) {
    setIsChecked((prevIsChecked) => {
      const newCheckedState = !prevIsChecked[fullPath];
      const newIsChecked = { ...prevIsChecked, [fullPath]: newCheckedState };

      return newIsChecked;
    });
  }
  
  
  function renderFileNode(node: FileNode, path: string = ''): JSX.Element {
    const fullPath = path ? `${path}/${node.name}` : node.name;
  
    return node.type === 'folder' ? (
      <div key={fullPath}>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-muted px-4 py-2 rounded-md">
          <FolderIcon
            className={`h-5 w-5 text-muted-foreground cursor-pointer ${
              expandedFolders.has(fullPath) ? 'text-primary' : ''
            }`}
            onClick={() => handleFolderToggle(fullPath)}
          />
          <div>
            <h4 className="font-medium">{node.name}</h4>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleFolderToggle(fullPath)}>
            {expandedFolders.has(fullPath) ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
        {expandedFolders.has(fullPath) && node.children && (
          <div className="pl-8">
            {node.children.map((child) => renderFileNode(child, fullPath))}
          </div>
        )}
      </div>
    ) : (
      <div
        key={fullPath}
        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-muted px-4 py-2 rounded-md"
      >
        <FileIcon className="h-5 w-5 text-muted-foreground" />
        <div>
          <h4 className="font-medium">{node.name}</h4>
        </div>
        <Checkbox
          className="h-5 w-5"
          checked={isChecked[fullPath] || false} // Pass the correct checked state
          onCheckedChange={() => handleCheckboxChange(fullPath)} // React to state changes
        />
      </div>
    );
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <GithubIcon className="h-6 w-6" />
              <span>{organisation} / {repo} / {branch}</span>
            </div>
          </DialogTitle>
          <DialogDescription>Browse and select files from the repository.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {files.map(node => renderFileNode(node))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-auto">
            Close
          </Button>
          <Button onClick={() => onSubmit({ filepaths: selectedFiles }, repo, branch)}>
            Select File(s) ({selectedFiles.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




function ChevronRightIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 9-6 6-6-6" />
    </svg>
  );
}

function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FolderIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function GithubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
