import * as React from "react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import {FileSelectorModal} from "./file-selector-modal";
import { BranchSelector } from "./branch-selector";
import { Download, RotateCcw, Trash2 } from "lucide-react";
import { ClipLoader, ScaleLoader } from "react-spinners";
import { JsonModal } from "./json-modal";

// Define TypeScript interfaces for repo data
interface Repo {
  branch: string;
  branch_names: string[];
  collection_generated: boolean;
  collection_url: string;
  repo_name: string;
  repo_url: string;
  selectedBranch?: string;
  loading?: boolean;
}

interface RepoResponse {
  account: string;
  data: Repo[];
  message: string;
  status_code: number;
}

interface RepoTableProps {
  organization: string; // Organization name passed as a prop
  username: string;
}

export function RepoTable({ organization, username }: RepoTableProps) {
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [openRepo, setOpenRepo] = React.useState<string | null>(null);
  const [current_organization, setOrganization] = React.useState<string>('');
  const [apiResponse, setApiResponse] = React.useState(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showJsonModal, setShowJsonModal] = React.useState(false);
  const [jsonData, setJsonData] = React.useState<any>(null);

  const handleModalClose = () => setOpenRepo(null);
  const handleFileSubmit = async (selectedFiles: { filepaths: string[] }, repo_name :string, repo_branch: string) => {
    setRepos(prevRepos =>
      prevRepos.map(repo =>
        repo.repo_name === repo_name ? { ...repo, loading: true } : repo
      )
    );

    // Handle file selection
    console.log(selectedFiles);
    handleModalClose();
    const { filepaths } = selectedFiles;
    const accessToken = Cookies.get('access_token'); // Get access token from cookies

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await fetch(
        `https://api.postlog.gethiroscope.com/repo/generate-postman-collection/${organization}/${repo_name}/${repo_branch}/contents/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': `${accessToken}`
          },
          body: JSON.stringify({ filepaths })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data); // Store API response in state
      setJsonData(data); // Store the JSON response data
      if (!showJsonModal) {
        setShowJsonModal(true); // Open the modal to show JSON response
        console.log("Opened Json Modal")
      }
    } catch (error) {
      console.error('Error submitting files:', error);
    }

  };

  const handleReset = async(repo_name: string) => {
    setRepos(prevRepos =>
      prevRepos.map(repo =>
        repo.repo_name === repo_name ? { ...repo, loading: true } : repo
      )
    );
    
    const accessToken = Cookies.get('access_token'); // Get access token from cookies

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await fetch(
        `https://api.postlog.gethiroscope.com/repo/delete-collection/${organization}/${repo_name}`,
        {
          method: 'POST',
          headers: {
            'x-access-tokens': `${accessToken}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data); 
    } catch (error) {
      console.error('Error Resetting collection:', error);
    }

  }


  // Fetch repositories from the API
  React.useEffect(() => {

    if(apiResponse){
      console.log("API Response", apiResponse)
    }

    async function fetchRepos() {
      try {
        setOrganization(organization);
        // Fetch token from cookies
        const token = Cookies.get("access_token")
        // console.log("Access", token)

        if (!token) {
          throw new Error("Access token not found in cookies");
        }

        if(organization===username){
          console.log("org:", organization)
          const response = await fetch("https://api.postlog.gethiroscope.com/repo/get_repositories", {
            method: "POST",
            headers: {
              'x-access-tokens': `${token}`,
              'Content-Type': "application/json",
            },
            
            body: JSON.stringify({
              org_flag: false,
            }),
          });

          if (!response.ok) {
            console.log("Organisation:", organization)
            throw new Error("Failed to fetch repositories");
          }
  
          const data: RepoResponse = await response.json();
          setRepos(data.data); // Set the repository data
          console.log("Repo Data: ", data.data)


        } else if (organization) {
          console.log("org:", organization)

          const response = await fetch("https://api.postlog.gethiroscope.com/repo/get_repositories", {
            method: "POST",
            headers: {
              'x-access-tokens': `${token}`,
              'Content-Type': "application/json",
            },
            
            body: JSON.stringify({
              org_flag: true,
              organization: organization,
            }),
          });

          if (!response.ok) {
            console.log("Organisation:", organization)

            throw new Error("Failed to fetch repositories");
          }
  
          const data: RepoResponse = await response.json();
          setRepos(data.data); // Set the repository data
          console.log("Repo Data: ", data.data)

        }

      } catch (error) {
        console.error(error);
        setError("Failed to fetch repositories.");
      } finally{
        setLoading(false);
      }
    }

    fetchRepos();
  }, [organization, apiResponse]); // Re-fetch data if the organization changes

  const handleBranchSelect = (repoUrl: string, selectedBranch: string) => {
    setRepos(prevRepos =>
      prevRepos.map(repo =>
        repo.repo_url === repoUrl
          ? { ...repo, selectedBranch }
          : repo
      )
    );
  };

  const handsleJsonModalClose = () => {
    setShowJsonModal(false);
  }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <>
    {loading?(
      <div className="flex items-center justify-center">
        <ClipLoader/>
      </div>
    ):(

   
    <div>
      {repos.map((repo) => (
        <div
          key={repo.repo_url}
          className="flex items-center space-x-4 rounded-md border p-4"
        >
          {/* Repo name and branch */}
          <div className="flex w-1/3 overflow-hidden whitespace-nowrap">
            {repo.repo_name}
          </div>

            {repo.loading ?(
              <div  className="flex-1 flex justify-end p-2 space-x-2">
                <ScaleLoader color="#000000"/>
              </div>
            ):(
              repo.collection_generated ? (
                //space for the download collection and delete collection
                <div className="flex-1 flex justify-end p-2 space-x-2"> 
                   <Button
                     onClick={() => {window.open(repo.collection_url, '_blank');}}
                   >
                     Download  <Download className="ml-3"/>
                   </Button>
 
                 <Button
                     variant="destructive"
                     onClick={() => handleReset(repo.repo_name)}
                   >
                   <RotateCcw />
                   </Button>
                   {/* JSON Modal */}
                  <JsonModal
                      isOpen={showJsonModal}
                      onClose={handsleJsonModalClose}
                      jsonData={jsonData}
                      collection_url={repo.collection_url}
                    />
                </div>
                
               ) : (
               <div className="flex-1 flex items-center text-muted-foreground">
                 <div className="flex w-1/3 overflow-hidden whitespace-nowrap">
                     <BranchSelector branches={repo.branch_names} default_branch={repo.branch} onBranchSelect={(selectedBranch) => handleBranchSelect(repo.repo_url, selectedBranch)} />
                 </div>
                 <div className="flex ml-auto">
                   <Button
                     onClick={() => setOpenRepo(repo.repo_url)}
                   >
                     Import
                   </Button>
                   {openRepo === repo.repo_url && (
                     <FileSelectorModal
                       username= {username}
                       organisation={current_organization}
                       repo={repo.repo_name}
                       branch={repo.selectedBranch || repo.branch}
                       isOpen={Boolean(openRepo)}
                       onClose={handleModalClose}
                       onSubmit={handleFileSubmit}
                     />
                   )}
                 </div>
              </div>
 
               )
            )}
          

            
          {/* Import button */}
          
        </div>
      ))}
    </div>
  

    )} 

  </>
)

}