
///belows is a tabs nav bar 

function TrainingTabsInstructor(){
    
    return(
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
                    <a id = 'excersise-tab'  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-purple-500 dark:hover:text-purple-500">Excercises</a>
            </li>
            <li className="mr-2">
                    <a  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-purple-500 dark:hover:text-purple-500" aria-current="page">Skills</a>
            </li>
            <li className="mr-2">
                    <a id = 'modules-tab'   className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-purple-500 dark:hover:text-purple-500">Modules</a>
            </li>
            <li className="mr-2">
                    <a id = 'resources-tab' className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-purple-500 dark:hover:text-purple-500">Resources</a>
            </li>
            </ul>
         </div>
    )
}

export {TrainingTabsInstructor}