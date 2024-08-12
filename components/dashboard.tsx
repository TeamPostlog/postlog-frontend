import { Settings, SquareChartGantt, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { AccountCombobox } from "./account-selector";
import { RepoTable } from "./repo-table";
import { MenuItem } from './types';
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Use correct hooks for App Router
import Cookies from "js-cookie";



export function Dashboard () {
    const [selectedItem, setSelectedItem] = useState('Repositories');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState('');
    const [userImage, setuserImage] = useState('');

    const menuItems : MenuItem [] = [
        {
            href: '#', icon: SquareChartGantt , label: 'Repositories', children: false, id: undefined
        },
        {
            href: '#', icon: UsersRound , label: 'Collaborators', children: false, id: undefined
        },
    ];

    const handleMainMenuClick = (label: string) => {
        if (label === 'Repositories'){
            setSelectedItem('Repositories');
        } else if (label === 'Collaborators'){
            setSelectedItem('Collaborators');
        }
    }

    const fetchUser = async() => {
        try {
            console.log("Fetching User Details");
            const token = Cookies.get('access_token');
            console.log(token)

            if(!token){
                throw new Error('No access token found');
            }
            const response = await fetch('https://api.postlog.gethiroscope.com/dashboard', {
                headers: {
                    'x-access-tokens': `${token}`,
                    'Accept': 'json/application'
                }
            })

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                console.log('Error from server:', data);
                throw new Error(data.message || 'Failed to fetch user details');
            }


            setUsername(data.user.username)
            setuserImage(data.user.avatar_url)

        }catch (e){
            console.log("Error in fetching user:", e)

        }

    }

    useEffect(() => {
        fetchUser();
        // Check if the access_token query parameter is present
        if (searchParams.get('access_token')) {
          // Create a new URL object
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('access_token');
    
          // Update the URL without reloading the page
          window.history.replaceState({}, '', newUrl.toString());
        }
      }, [searchParams]);

    return(
        <div className="flex h-screen">
            <aside className="flex flex-col items-center w-[25vh] p-4 border-r">
                <div className="mb-10">
                    <img 
                        src="/logo.svg"
                        className="w-[15vh]"
                        alt="Logo"
                    />
                </div>
                <div className="flex items-center justify-center mb-4">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={userImage} />
                        <AvatarFallback>Profile</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex items-center justify-center text-xl">
                    Kuldeep Paul
                </div>
                <div className="flex items-center justify-center text-sm mb-20 md:w-full sm:w-1/2 overflow-hidden whitespace-nowrap">
                    <span className="text-ellipsis">
                        {username}
                    </span>
                </div>


                <nav className="flex-1">
                    {menuItems.map((item) => (
                        <div key={item.label} className="flex-1 items-center justify-center w-full mb-4">
                        <Button variant="ghost" 
                        className={`flex items-center w-full text-center text-lg font-normal ${selectedItem === item.label ? 'text-primary bg-gray-100' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => handleMainMenuClick(item.label)}
                        >
                            <item.icon className="mr-4"/>
                            <span>{item.label}</span>
                        </Button>
                        </div>

                    ))}
                    
                </nav>


                <div className="flex bottom-20 items-center justify-center mb-4">
                <Button variant="ghost" className="flex items-center w-full text-center text-lg font-normal">
                        <Settings className="mr-4"/>
                        Settings
                </Button>
                </div>
            </aside>

            {selectedItem === 'Repositories'?(
                <div className="flex flex-col w-[100vh] mx-auto p-10">
                <div className="flex mt-5 mb-12">
                    <div className="text-3xl font-semibold">
                        Repositories
                    </div>
                    <div className="ml-auto mr-[5vh]">
                    <AccountCombobox />
                    </div>
                    
                </div>
                <div className="mr-[5vh]">
                    <RepoTable/>
                </div>
            </div>
        
        ):selectedItem === 'Collaborators'?(
            <div className="flex flex-col w-[100vh] mx-auto p-10">
                <div className="flex mt-5 mb-12">
                    <div className="text-3xl font-semibold">
                        Collaborators
                    </div>
                    
                </div>
                <div className="mr-[5vh]">
                    Collaborator Table
                </div>
            </div>

        ):null}
        </div>
            
    )
}