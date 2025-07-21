document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  //const dataForm = document.getElementById("data-form");
  const dataAdd = document.getElementById("add");
  const dataInput = document.getElementById("data-input");

  // Function to fetch data from the backend Original 
  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("/data");
  //     const data = await response.json();
  //     dataList.innerHTML = ""; // Clear the list before rendering
  //     data.forEach((item) => {
  //       const li = document.createElement("li");
  //       li.textContent = item.id + ": " + JSON.stringify(item);
  //       dataList.appendChild(li);
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

    // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering
      
      data.forEach((item) => {

        const li = document.createElement("li");
        li.textContent = item.id + ": " + JSON.stringify(item);
      
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked || false; // Use backend value if it exists

      li.appendChild(checkbox); // Append checkbox to list item
      dataList.appendChild(li); // Now append list item
      
    });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle form submission to ADD new data
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevents relaod of page on form submit
    const newData = { text: dataInput.value }; //Creates object of he new inputted data

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
  dataAdd.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value };

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
  });


    // Handle form submission to DELETE data
  dataAdd.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newData = { text: dataInput.value.trim() };
  if (!newData) return;

  // Sending data to backend/json-file
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
  });

  // Fetch data on page load
  fetchData();
});
