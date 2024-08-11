import { Settings, SquareChartGantt, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { AccountCombobox } from "./account-selector";
import { RepoTable } from "./repo-table";
import { MenuItem } from './types';
import { useState } from "react";


export function Dashboard () {
    const [selectedItem, setSelectedItem] = useState('Repositories');

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
                        <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png" />
                        <AvatarFallback>Profile</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex items-center justify-center text-xl">
                    Kuldeep Paul
                </div>
                <div className="flex items-center justify-center text-sm mb-20 md:w-full sm:w-1/2 overflow-hidden whitespace-nowrap">
                    <span className="text-ellipsis">
                        kuldeep.paul08@gmail.com
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