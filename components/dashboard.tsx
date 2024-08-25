import { LogOutIcon, PhoneIcon, Settings, SquareChartGantt, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { AccountCombobox } from "./account-selector";
import { RepoTable } from "./repo-table";
import { MenuItem } from './types';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import LogoutButton from "./logout-button";
import Feedback from "./canny-feedback"

export function Dashboard () {
    const [selectedItem, setSelectedItem] = useState('Repositories');
    const searchParams = useSearchParams();
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [name, setName] = useState('');
    const [selectedOrganisation, setSelectedOrganisation] = useState('');
    const [loading, setLoading] = useState(true)

    const menuItems : MenuItem[] = [
        {
            href: '#', icon: SquareChartGantt , label: 'Repositories', children: false, id: undefined
        },
        {
            href: '#', icon: UsersRound , label: 'Feedback', children: false, id: undefined
        },
    ];

    const handleMainMenuClick = (label: string) => {
        setSelectedItem(label);
    }

    const fetchUser = async() => {
        try {
            console.log("Fetching User Details");
            const token = Cookies.get('access_token');
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
            setUserImage(data.user.avatar_url)
            setName(data.user.name)

        } catch (e) {
            console.log("Error in fetching user:", e)
        } finally {
            setLoading(false)
        }
    }

    const handleAccountSelect = (account: string) => {
        setSelectedOrganisation(account);
    }


    useEffect(() => {
        if (!selectedOrganisation) {
            setSelectedOrganisation(username); // Set default to username
        }
    }, [username, selectedOrganisation]);

    useEffect(() => {
        fetchUser();

        if (searchParams.get('access_token')) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('access_token');
            window.history.replaceState({}, '', newUrl.toString());
        }
    }, [searchParams]);

    return (
        <div className="flex h-screen justify-center">
            {loading?(
                <ClipLoader />
            ):(
            <>
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
                    {name}
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
                    <LogoutButton/>
                </div>
            </aside>

            {selectedItem === 'Repositories' ? (
                <div className="flex flex-col w-[100vh] mx-auto overflow-auto p-10">
                    <div className="flex mt-5 mb-12">
                        <div className="text-3xl font-semibold">
                            Repositories
                        </div>
                        <div className="ml-auto mr-[5vh]">
                            {username && (
                                <AccountCombobox 
                                    username={username} 
                                    userAvatar={userImage} 
                                    onAccountSelect={handleAccountSelect} 
                                />
                            )}
                        </div>
                    </div>
                    <div className="mr-[5vh]">
                        <RepoTable username={username} organization={selectedOrganisation} />
                    </div>
                </div>
            ) : selectedItem === 'Feedback' ? (
                <div className="flex flex-col w-[100vh] h-full mx-auto overflow-auto p-10">
                    <div className="flex mt-5 mb-10">
                        <div className="text-3xl font-semibold">
                            Feedback and Feature Requests
                        </div>
                        <div className="ml-auto">
                            <Button onClick={() => {window.open("https://cal.com/postlog/quick-catchup-call", '_blank');}}>
                                <PhoneIcon className="mr-4 w-4 h-4"/> Call the Founders 
                            </Button>
                        </div>
                    </div>
                    <div className="h-full overflow-auto">
                    <Feedback/>
                    </div>
                </div>
            ) : null}
            </>

            )}            
        </div>
    )
}
