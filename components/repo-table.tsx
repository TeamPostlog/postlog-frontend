import * as React from "react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import {FileSelectorModal} from "./file-selector-modal";
import { BranchSelector } from "./branch-selector";
import { Download, RotateCcw, Trash2 } from "lucide-react";

// Define TypeScript interfaces for repo data
interface Repo {
  branch: string;
  branch_names: string[];
  collection_generated: boolean;
  collection_url: string;
  repo_name: string;
  repo_url: string;
  selectedBranch?: string;
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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [openRepo, setOpenRepo] = React.useState<string | null>(null);
  const [current_organization, setOrganization] = React.useState<string>('');
  const [apiResponse, setApiResponse] = React.useState(null);

  const handleModalClose = () => setOpenRepo(null);
  const handleFileSubmit = async (selectedFiles: { filepaths: string[] }, repo_name :string) => {
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
        `https://api.postlog.gethiroscope.com/repo/generate-postman-collection/${organization}/${repo_name}/contents/`,
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
    } catch (error) {
      console.error('Error submitting files:', error);
    }

  };

  const handleReset = async(repo: string) => {
    const accessToken = Cookies.get('access_token'); // Get access token from cookies

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await fetch(
        `https://api.postlog.gethiroscope.com/repo/delete-collection/${organization}/${repo}`,
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
            throw new Error("Failed to fetch repositories");
          }
  
          const data: RepoResponse = await response.json();
          setRepos(data.data); // Set the repository data
          console.log("Repo Data: ", data.data)


        } else {
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
            throw new Error("Failed to fetch repositories");
          }
  
          const data: RepoResponse = await response.json();
          setRepos(data.data); // Set the repository data
          console.log("Repo Data: ", data.data)

        }

      } catch (error) {
        console.error(error);
        setError("Failed to fetch repositories.");
      } finally {
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

  if (loading) {
    return <div>Loading repositories...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
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

            {loading ?(<div className="flex-1 flex"> Generating... </div>):(null)}
          

            {repo.collection_generated ? (
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

              )}
          {/* Import button */}
          
        </div>
      ))}
    </div>
  );
}
