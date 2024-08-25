"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the props type
interface BranchSelectorProps {
  branches: string[];
  default_branch: string;
  onBranchSelect?: (branch: string) => void;
}

export function BranchSelector({ branches, default_branch,  onBranchSelect }: BranchSelectorProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    if(value === ''){
      handleSelect(default_branch)
    }
  })

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    setValue(newValue);
    setOpen(false);
    if (onBranchSelect) {
      onBranchSelect(newValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || "Select branch..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandList>
            <CommandEmpty>No branch found.</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch}
                  value={branch}
                  onSelect={() => handleSelect(branch)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === branch ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {branch}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
