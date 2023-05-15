//different buttons no functionality basically different layouts and potential type of buttons
export function SearchButton(){//Search button
    return(
        <button className="bg-purple-800 border border-2 border-black hover:bg-purple-500 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline" type="button">
        Search
        </button>
    )
}
export function Dropdown(){//tentative dropdown button
    return(
        <>
        <div>
            <div>
                <button type="button" className="bg-purple-800 border border-2 border-black hover:bg-purple-500 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline">
                Columns
                </button>
            </div>

            <div className="hidden mt-2 w-56 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1" role="none">
                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem"  id="menu-item-0">Account settings</a>
                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem"  id="menu-item-1">Support</a>
                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">License</a>
                <form method="POST" action="#" role="none">
                    <button type="submit" className="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" id="menu-item-3">Sign out</button>
                </form>
                </div>
            </div>
        </div>
        </>
    )
}
export function InputText(){//input bar
   return(
     <input type= 'text' placeholder= 'Search Students...' className='h-full ml-2 pl-2'/>
     )
}
export function ExportCVS(){//Used to export selected on CVS button
    return(
        <button className="bg-purple-800  h-full border border-2 border-black hover:bg-purple-500 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline" type="button">
        Export Student as CSV
        </button>
    )
}
export function AddButton(){//Used to add to table
    return(
        <button className="bg-purple-800  h-full border border-2 border-black hover:bg-purple-500 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline" type="button">
        Add
        </button>
    )
}
export function EditButton(){//Used to edit selected
    return(
        <button className="bg-purple-800 border border-2 border-black hover:bg-purple-500 text-white font-bold py-2 px-8 text-lg  focus:outline-none focus:shadow-outline" type="button">
        Edit Selected
        </button>
    )
}
export function DeleteButton(){//Used to edit selected
    return(
        <button className="bg-purple-800 border border-2 border-black hover:bg-purple-500 text-white font-bold py-2 px-8 text-lg  focus:outline-none focus:shadow-outline" type="button">
        Delete Selected
        </button>
    )
}
export function SearchUI(){// search bar with a columns drop down
    return(
        <div className="flex align-center overflow-x-scroll mb-2">
        <div className="mr-3">
            <SearchButton/>
        </div>
        <div className="mr-3">
            <Dropdown/>
        </div>
        <div className="h-full w-96">
            <InputText/>
        </div>
    </div>
    )
}
interface InputDropDown {
    dictionary : {id:string, name:string, type:string}[];
    selected: string
}




