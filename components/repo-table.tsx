import { Button } from "./ui/button";



export function RepoTable (){

    return(
        <div>
        <div className=" flex items-center justify-between space-x-4 rounded-md border p-4">
            <div className="flex w-1/3 overflow-hidden whitespace-nowrap">
                Here goes the repo name!
            </div>
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Generating...
            </div>
            <div>
                <Button>
                    Import
                </Button>
            </div>
        </div>
        <div className=" flex items-center justify-between space-x-4 rounded-md border p-4">
            <div className="flex w-1/3 overflow-hidden whitespace-nowrap">
                Here goes the second repo name!
            </div>
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Generating...
            </div>
            <div>
                <Button>
                    Import
                </Button>
            </div>
        </div>
    </div>

    )
}