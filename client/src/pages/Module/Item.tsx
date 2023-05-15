
function Item({ item } : any) {

    function handleLinkClick(event : any) {
        event.preventDefault(); // prevent the default redirect behavior
      
        fetch(item.contentlocation)
          .then(response => response.blob())
          .then(blob => {
            // create a new URL for the blob
            const blobUrl = URL.createObjectURL(blob);
      
            // create a new link element and click it to download the resource
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = item.contentname;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(error => console.error(error));
    }

    return (
      <div className="border border-2 border-black rounded-md bg-gray-100">
          <div className="px-6 py-4">
              <div className="font-bold text-xl mb-5">{item.contentname}</div>
              <div>
                  {item.mediatype.includes("video") && (
                      <div>
                          <video controls width={500} className="mb-5">
                              <source src={item.contentlocation} type="video/mp4" />
                          </video>
                          <a href={item.contentlocation} onClick={handleLinkClick} className="block mt-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                      </div>
                  )}
                  {item.mediatype.includes("image") && (
                    <div>
                        <img src={item.contentlocation} width={500} className="mb-5"/>
                        <a href={item.contentlocation} onClick={handleLinkClick} className="block mt-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                    </div>
                  )}
                  {item.mediatype.includes("pdf") && ( 
                      <div>
                          <embed src={item.contentlocation} width="600px" height="300px" className="mb-5" />
                          <a href={item.contentlocation} onClick={handleLinkClick} className="block mt-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                      </div>
                  )}
                  {!item.mediatype.includes("image") && !item.mediatype.includes("video") && !item.mediatype.includes("pdf") && (
                      <a href={item.contentlocation} onClick={handleLinkClick} className="block mt-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                  )}
              </div>
          </div>
      </div>
    )
  }
  
  export default Item
  
