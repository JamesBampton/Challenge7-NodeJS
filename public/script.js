document.addEventListener("DOMContentLoaded", () => {
    if (window.hasInitialized) return;
    window.hasInitialized = true;
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("dataForm");
  // const dataAdd = document.getElementById("add");
  const dataDelete = document.getElementById("delete");
  const dataEdit = document.getElementById("edit");
  const dataInput = document.getElementById("data-input");
  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering
      
      data.forEach((item) => {

        const li = document.createElement("li");
        //li.textContent = item.id + ": " + JSON.stringify(item); // Shows the JSON string, not needed as I place the 'text' only into a div below
        const textDiv = document.createElement("div");
        textDiv.textContent =item.text;
        textDiv.style.whiteSpace = "pre-line";
        li.appendChild(textDiv);

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "selected-item" // Set name so all share same name, so only one will be selected
      radio.value = item.id;

      li.appendChild(radio); // Append checkbox to list item
      dataList.appendChild(li); // Now append list item
      
    });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
  editFunction();

  // Handle form submission to ADD new data
  dataForm.addEventListener("submit", async (event) => {
    dataForm.style.height ="auto";
    dataForm.style.height = dataInput.scrollHeight + "px";
    event.preventDefault(); // prevents relaod of page on form submit
    const newData = { text: dataInput.value }; //Creates object of he new inputted data
    console.log("So this is the new data hey? ", newData)
    
    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),

      });
      console.log(response)

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

  // Handle form submission to DELETE data
  dataDelete.addEventListener("click", async (event) => {
  event.preventDefault();
  const selectRadio = dataList.querySelector("input[type='radio']:checked");
  
  const idToDelete = selectRadio.value;
console.log (idToDelete)
  // Sending a delete call to backend/json-file
    try {
      await fetch(`/data/${idToDelete}`,
      { 
        method: "delete",
      });
    } catch (error) {
      console.error(`Failed to delete requested ID ${idToDelete}:`, error);
    }
  // Fetch data on page load to show updated, deleted values
  fetchData();
  });
});

// EDIT MODAL 

 //Edit Modal
  /*       document.getElementById('edit').addEventListener('click', function () {
            const modalElement = document.getElementById('editModal');
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();
        });
        fetchData(); */


    function editFunction() {
        document.getElementById('edit').addEventListener('click', function () {
    const selectedRadio = document.querySelector('#data-list input[type="radio"]:checked');
    if (!selectedRadio) {
        alert("Please select a note to edit.");
        return;
    }

    const listItem = selectedRadio.parentElement;
    const currentText = listItem.querySelector('div').textContent.trim();

    // Set modal input value
    document.getElementById('task').value = currentText;

    // Store selected ID for later use
    document.getElementById('editModal').dataset.selectedId = selectedRadio.value;

    // Show modal
    const modalInstance = new bootstrap.Modal(document.getElementById('editModal'));
    modalInstance.show();
});
    }

  // Handle form submission to EDIT data
async function onClickaddButton() {
    const modal = document.getElementById('editModal');
    const updatedText = document.getElementById('task').value;
    const selectedId = modal.dataset.selectedId;

    if (!updatedText.trim()) {
        alert("Please enter valid text.");
        return;
    }

    try {
        const response = await fetch(`/data/${selectedId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: updatedText })
        });

        if (response.ok) {
            fetchData(); // Refresh list then close the modal as below.
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide(); // Close modal after fetch data, else the dat will not be fetched, remove the modal close on the button
        } else {
            console.error("Failed to update note.");
        }
    } catch (error) {
        console.error("Error updating note:", error);
    }
}


