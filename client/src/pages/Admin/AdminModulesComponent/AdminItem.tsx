import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

function AdminItem({ item, deleteItem } : any) {
   const [open, setOpen] = useState(false);

   const handleClickOpen = () => {
    setOpen(true);
   };

   const handleClose = () => {
    setOpen(false);
   };

   const handleDelete = () => {
    deleteItem(item.contentid);
    setOpen(false);
   };

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
                        <a href={item.contentlocation}  onClick={handleLinkClick} className="block mt-4 mb-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                    </div>
                )}
                {item.mediatype.includes("image") && (
                <div>
                    <img src={item.contentlocation} width={500} className="mb-5"/>
                    <a href={item.contentlocation} onClick={handleLinkClick} className="block mt-4 mb-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                </div>
                )}
                {item.mediatype.includes("pdf") && ( 
                    <div>
                        <embed src={item.contentlocation} width="600px" height="300px" className="mb-5" />
                        <a href={item.contentlocation}  onClick={handleLinkClick} className="block mt-4 mb-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                    </div>
                )}
                {!item.mediatype.includes("image") && !item.mediatype.includes("video") && !item.mediatype.includes("pdf") && (
                    <a href={item.contentlocation}  onClick={handleLinkClick} className="block mb-4 text-blue-500 hover:text-blue-700 hover:underline">Download {item.contentname}</a>
                )}
            </div>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={handleClickOpen}
                >
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this resource?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    </div>
  )
}

export default AdminItem

  