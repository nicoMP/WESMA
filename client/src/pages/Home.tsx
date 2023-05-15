function Home() {
  return(
    <>
    <div className=" flex flex-col justify-evenly overflow-y-auto h-screen w-full bg-zinc-200">
      <span>
        <h1 className= 'text-center text-4xl text-purple-900 mb-2'>Home</h1>
        <p className = 'mt-5 mx-5 text-left text-l'>
          The intention of WESMA is to significantly reduce the time that requires the shop training instructor to retrieve and handle the students’ record each year. Currently, the shop training instructor needs to export the data from the OWL site from the previous year, then manually make the required changes to update the next year's cycle to maintain accurate information. Given that in 2020 alone, there were around 2,151 undergraduate students who enrolled in the Engineering Faculty, the manual process is way too tedious of a task for a single person. During an interview with the project advisor, it was noted that it can take over 80 hours to manually update student records in the CHUBB card access database which is a separate additional task over and above the management of training records mentioned above. So, WESMA is also aiming to reduce the time to perform that manual process as well. 
        </p>   
      </span>
      <span>
      <h1  className= 'text-center text-4xl text-purple-900 my-2'>Contact</h1>
        <p className = 'mt-5 mx-5 text-center text-l'>
          If you have any questions, please feel free to contact:
          <br/>Dr. Duane Jacques
          <br/>Assistant Professor & Student Shops Advisor
          <br/>General Inquires: weshops@uwo.ca
          <br/>Phone: 519-661-2111 x86906
        </p>
      </span>
    </div>

  </>
  )
}

export default Home;