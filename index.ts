function saveToLocalStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function loadFromLocalStorage() {
    const storedData = localStorage.getItem("employees");
    if (storedData) {
        employees.push(...JSON.parse(storedData));
    }
}

// Load data from local storage and render on page load
loadFromLocalStorage();
renderEmployeeList();


interface Employee {
    id: string;
    name: string;
    position: string;
}

const employees: Employee[] = [];
let selectedEmployee: Employee | null = null;

function renderEmployeeList() {
    const tbody = document.getElementById("employee-table-body")!;
    const filterSelect = document.getElementById("filter-select") as HTMLSelectElement;
    filterSelect.innerHTML = '<option value="">All Positions</option>';

    const uniquePositions = new Set(employees.map(emp => emp.position));
    uniquePositions.forEach(position => {
        const option = document.createElement("option");
        option.value = position;
        option.textContent = position;
        filterSelect.appendChild(option);
    });

    applyFilters();
}

function applyFilters() {
    const tbody = document.getElementById("employee-table-body")!;
    const searchInput = (document.getElementById("search-input") as HTMLInputElement).value.toLowerCase();
    const filterValue = (document.getElementById("filter-select") as HTMLSelectElement).value;

    tbody.innerHTML = "";

    employees
        .filter(emp => {
            const matchesSearch =
                emp.name.toLowerCase().includes(searchInput) ||
                emp.id.toLowerCase().includes(searchInput) ||
                emp.position.toLowerCase().includes(searchInput);

            const matchesFilter = filterValue ? emp.position === filterValue : true;

            return matchesSearch && matchesFilter;
        })
        .forEach(employee => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>
                    <button onclick="viewEmployee('${employee.id}')">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
}

function showEmployeeList() {
    document.getElementById("employee-list")!.classList.remove("hidden");
    document.getElementById("employee-details")!.classList.add("hidden");
    document.getElementById("employee-form")!.classList.add("hidden");
}

function viewEmployee(id: string) {
    selectedEmployee = employees.find(emp => emp.id === id) || null;
    if (selectedEmployee) {
        document.getElementById("detail-id")!.textContent = selectedEmployee.id;
        document.getElementById("detail-name")!.textContent = selectedEmployee.name;
        document.getElementById("detail-position")!.textContent = selectedEmployee.position;

        document.getElementById("employee-list")!.classList.add("hidden");
        document.getElementById("employee-details")!.classList.remove("hidden");
    }
}

function showAddEmployeeForm() {
    selectedEmployee = null;
    document.getElementById("form-title")!.textContent = "Add Employee";
    (document.getElementById("employee-id") as HTMLInputElement).value = "";
    (document.getElementById("employee-name") as HTMLInputElement).value = "";
    (document.getElementById("employee-position") as HTMLInputElement).value = "";

    document.getElementById("employee-list")!.classList.add("hidden");
    document.getElementById("employee-form")!.classList.remove("hidden");
}

function saveEmployee(event: Event) {
    event.preventDefault();
    const id = (document.getElementById("employee-id") as HTMLInputElement).value;
    const name = (document.getElementById("employee-name") as HTMLInputElement).value;
    const position = (document.getElementById("employee-position") as HTMLInputElement).value;

    if (selectedEmployee) {
        // Edit existing employee
        selectedEmployee.id = id;
        selectedEmployee.name = name;
        selectedEmployee.position = position;
    } else {
        // Add new employee
        employees.push({ id, name, position });
    }
    // saveToLocalStorage(); // Save changes
    renderEmployeeList();
    showEmployeeList();
}

function editEmployee() {
    if (selectedEmployee) {
        document.getElementById("form-title")!.textContent = "Edit Employee";
        (document.getElementById("employee-id") as HTMLInputElement).value = selectedEmployee.id;
        (document.getElementById("employee-name") as HTMLInputElement).value = selectedEmployee.name;
        (document.getElementById("employee-position") as HTMLInputElement).value = selectedEmployee.position;

        document.getElementById("employee-details")!.classList.add("hidden");
        document.getElementById("employee-form")!.classList.remove("hidden");
    }
}

function deleteEmployee() {
    if (selectedEmployee) {
        const index = employees.findIndex(emp => emp.id === selectedEmployee!.id);
        employees.splice(index, 1);
        saveToLocalStorage(); // Save changes
        renderEmployeeList();
        showEmployeeList();
    }
}

// Initial Render
renderEmployeeList();
