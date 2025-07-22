document.addEventListener("DOMContentLoaded", () => {
    if (window.hasInitialized) return;
    window.hasInitialized = true;
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("dataForm");
  // const dataAdd = document.getElementById("add");
  const dataDelete = document.getElementById("delete");
  //const dataEdit = document.getElementById("edit");
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

  // Handle form submission to EDIT data
/*   dataEdit.addEventListener("submit", async (event) => {
    event.preventDefault();
    const checkboxEdit = dataList.querySelectorAll("input[type='checkbox']:checked");

    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  }); */

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
})
