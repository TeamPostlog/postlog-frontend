"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Organization {
  avatar_url: string;
  description: string | null;
  login: string;
}

interface AccountComboboxProps {
  onAccountSelect: (account: string) => void;
  username: string;
  userAvatar: string;
}

const sampleOrgs: Organization[] = [
  {
    avatar_url: "https://avatars.githubusercontent.com/u/46537458?v=4",
    description: "IoT and AI company...",
    login: "QuinchSystems",
  },
  {
    avatar_url: "https://avatars.githubusercontent.com/u/68285133?v=4",
    description: "Powering Industries with IOT and AI",
    login: "durbintech",
  },
]

export function AccountCombobox({ onAccountSelect, username, userAvatar }: AccountComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(username)
  const [orgs, setOrgs] = React.useState<Organization[]>([])
  const [loading, setLoading] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    onAccountSelect(currentValue)
    setOpen(false)
  }

  React.useEffect(() => {
    async function fetchOrganizations() {
      setLoading(true)

      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('access_token='))
          ?.split('=')[1]

        if (!token) {
          throw new Error("Access token not found in cookies")
        }

        const response = await fetch('https://api.postlog.gethiroscope.com/account/user_orgs', {
          method: 'GET',
          headers: {
            'x-access-tokens': `${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch organizations")
        }

        const data: Organization[] = await response.json()

        const userAccount = {
          avatar_url: userAvatar,
          description: "User Account",
          login: username,
        };

        const combinedData: Organization[] = [userAccount, ...data]

        setOrgs(combinedData)

      } catch (error) {
        console.error(error)
        setOrgs(sampleOrgs)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [username, userAvatar])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[230px] justify-between"
        >
          {value
            ? orgs.find((org) => org.login === value)?.login
            : "Select GitHub Organization"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandList>
            {loading && <CommandEmpty>Loading...</CommandEmpty>}
            {!loading && orgs.length === 0 && (
              <CommandEmpty>No organizations found.</CommandEmpty>
            )}
            <CommandGroup>
              {orgs.map((org) => (
                <CommandItem
                  key={org.login}
                  value={org.login}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === org.login ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <img
                    src={org.avatar_url}
                    alt={`${org.login} avatar`}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                  {org.login}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
