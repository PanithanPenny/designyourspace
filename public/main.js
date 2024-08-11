
import {
  setDragStartCallback,
  setDragMoveCallback,
  setDragEndCallback
} from "./draggable.js";


// ----------- Post Image import  ------------------------------

// if you want to attach extra logic to the drag motions, you can use these callbacks:
setDragStartCallback(function(element, x, y, scale, angle) {
  // console.log(element)
});
setDragMoveCallback(function(element, x, y, scale, angle) {
  // console.log(element)

});
setDragEndCallback(function(element, x, y, scale, angle) {
  // console.log(element)
  if (y > window.innerHeight - 60) {
    element.remove();
  }
});



document.addEventListener('DOMContentLoaded', () => {
  
  const imageOverlay = document.getElementById('image-overlay');
  if (imageOverlay) {
    imageOverlay.addEventListener('click', function(event) {
      event.stopPropagation(); // Stop click from propagating to the document
    });
  
  }


  function showItemList(listId) {
    document.querySelectorAll('.structure-items-list, .furniture-items-list, .tree-items-list, .people-items-list, .outdoor-items-list').forEach(list => {
      list.style.display = 'none';
    });
    document.querySelector('.' + listId).style.display = 'flex';
  }

  // Updated to not clear previous images and allow stacking
  function showOverlayImage(imageSrc) {


    const overlay = document.getElementById('image-overlay');
    if (!overlay) {
      console.error("Overlay element is missing in the DOM.");
      return;
    }

    // Create and add new image สร้างภาพ
    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'draggable';
    img.style.width = '15vw';
    img.style.height = 'auto';
    img.style.position = 'fixed';
    img.style.left = '50%';
    img.style.top = '50vh';
    img.style.transform = 'translate(-50%, -50%)';
    img.style.zIndex = 1000 + (overlay.children.length + 1);  // Ensure each new image overlays on top
    overlay.appendChild(img);

    img.addEventListener('click', function() {
        selectedImage = img;
        console.log('Image selected:', selectedImage);
    });


    // Display the overlay if not already visible
    if (overlay.style.display !== 'flex') {
      overlay.style.display = 'flex';
    }
    // img.addEventListener('dragstart', dragStart);


  }

  // Set up the overlay to handle the dragover and drop events


  // Add feature click item button to generate new image
  function setupButtonListeners() {
    document.querySelectorAll('.structure-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        console.log('button-click')
        // Assuming images are named like 'assets/structure1.png', 'assets/structure2.png', etc.
        showOverlayImage(`structure${index + 1}.png`);
      });


       });
    document.querySelectorAll('.furniture-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Assuming images are named like 'assets/structure1.png', 'assets/structure2.png', etc.
        showOverlayImage(`furniture${index + 1}.png`);
    });

  });

    document.querySelectorAll('.tree-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Assuming images are named like 'assets/structure1.png', 'assets/structure2.png', etc.
        showOverlayImage(`tree${index + 1}.png`);



        });
    });

    document.querySelectorAll('.people-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Assuming images are named like 'assets/structure1.png', 'assets/structure2.png', etc.
        showOverlayImage(`people${index + 1}.png`);

  });

});

     document.querySelectorAll('.outdoor-btn').forEach((btn, index) => {
          btn.addEventListener('click', () => {
            // Assuming images are named like 'assets/structure1.png', 'assets/structure2.png', etc.
            showOverlayImage(`outdoor${index + 1}.png`);

      });

    });



    // Setup for other item categories as needed
  }

  // Hide overlay on click
  document.getElementById('image-overlay').addEventListener('click', () => {
    // This will only hide the overlay without removing children
    // document.getElementById('image-overlay').style.display = 'none';
  });





  function resetBorders() {
    const categoryButtons = ['structure', 'furniture', 'tree', 'people','outdoor'];
    categoryButtons.forEach(id => {
      document.getElementById(id).style.border = "";
      document.getElementById(id).style.backgroundColor = "";
    });
  }

  function highlightButton(id) {
    resetBorders();
    document.getElementById(id).style.border = "3px solid #293592";
    document.getElementById(id).style.backgroundColor = "#e2f4f3";


  }

  ['structure', 'furniture', 'tree', 'people','outdoor'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      highlightButton(id);
      showItemList(`${id}-items-list`);
    });
  });

  showItemList('structure-items-list'); // Show 'structure-items-list' by default
  highlightButton('structure'); // Initialize with structure button highlighted

  // Initialize the button listeners for overlay images
  setupButtonListeners();
});


//--------------------------- Remove Button -----------------
// Add click event listener to the document

// Declare selectedImage in the global scope
let selectedImage = null;

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('draggable')) {
        selectedImage = event.target;  // Set the selected image when any draggable image is clicked
        console.log('Image selected:', selectedImage);
    }
});


let removeButton = document.getElementById('remove-button');
removeButton.addEventListener('click', function() {
  if (selectedImage) {
    console.log('Removing image:', selectedImage);
    selectedImage.remove();  // Remove the selected image
    selectedImage = null;    // Reset selectedImage to null after removal
  } else {
    console.log('No image selected to remove.');
  }
});

document.getElementById('image-overlay').addEventListener('click', function(event) {
    event.stopPropagation(); // Stop the click from propagating to images or document
    console.log('Overlay clicked; event propagation stopped.');
});



//capture screen and save image---------------------------------------------------------------------------------------------------

const captureButton = document.getElementById('save-button');
captureButton.addEventListener("click", captureImage);
let Area = document.getElementById('overlay')
function captureImage() {
  html2canvas(Area).then(canvas => {
    const link = document.createElement('a');
    link.download = 'captured-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(error => console.error('Capture failed:', error));
}


//---------------------------------------------------------------------------------------------------------------------------









//-------------------------Upload Image----------------------------

document.addEventListener('DOMContentLoaded', function () {
    let postButton = document.getElementById("post-button");
    let loader = document.getElementById("loader"); // Get the loader element
    loader.style.display = "none"; // Initially hide the loader

    postButton.addEventListener("click", async () => {
        console.log("Post button clicked");
        let Area2 = document.getElementById('overlay');
        if (Area2) {
            loader.style.display = "block"; //loading animation
            await captureImage2(Area2);
        } else {
            console.error('Overlay element not found');
        }
    });

    async function captureImage2(area) {
        try {
            const canvas = await html2canvas(area);
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));
            console.log(blob);
            const formData = new FormData();
            formData.append("image-upload", blob);

            const response = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Image uploaded successfully!");
                loader.style.display = "none"; //stop loading animation
                window.location.href = 'newsfeed.html';
                // await loadPosts();
            } else {
                throw new Error(`Failed to upload image: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error in capturing or uploading image:", error);
        }
    }

    async function loadPosts() {
        try {
            const response = await fetch("/api/listPosts");
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

              console.log("Fetched data success")
          
            
            const data = await response.json();
            const posts = document.getElementById("posts");
            if (posts) {
                let postsHTML = "";
                data.reverse().forEach((url) => {
                    postsHTML += `<img src="${url}" />`;
                });
                posts.innerHTML = postsHTML;
                console.log("Post item success")
            } else {
                console.error('Posts container element not found');
            }
        } catch (error) {
            console.error("Error loading posts:", error);
        }

          
      // JavaScript to navigate to another page
       // Change 'newsfeed.html' to your desired URL

    }
});



//--------------------------------------------------------------