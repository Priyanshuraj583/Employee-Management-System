var employees = [];
var selectedEmployee = null;
function saveToLocalStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}
function loadFromLocalStorage() {
    var storedData = localStorage.getItem("employees");
    if (storedData) {
        employees.push.apply(employees, JSON.parse(storedData));
    }
}
// Load data from local storage and render on page load
loadFromLocalStorage();
renderEmployeeList();

function renderEmployeeList() {
    var tbody = document.getElementById("employee-table-body");
    var filterSelect = document.getElementById("filter-select");
    filterSelect.innerHTML = '<option value="">All Positions</option>';
    var uniquePositions = new Set(employees.map(function (emp) { return emp.position; }));
    uniquePositions.forEach(function (position) {
        var option = document.createElement("option");
        option.value = position;
        option.textContent = position;
        filterSelect.appendChild(option);
    });
    applyFilters();
}
function applyFilters() {
    var tbody = document.getElementById("employee-table-body");
    var searchInput = document.getElementById("search-input").value.toLowerCase();
    var filterValue = document.getElementById("filter-select").value;
    tbody.innerHTML = "";
    employees
        .filter(function (emp) {
        var matchesSearch = emp.name.toLowerCase().includes(searchInput) ||
            emp.id.toLowerCase().includes(searchInput) ||
            emp.position.toLowerCase().includes(searchInput);
        var matchesFilter = filterValue ? emp.position === filterValue : true;
        return matchesSearch && matchesFilter;
    })
        .forEach(function (employee) {
        var row = document.createElement("tr");
        row.innerHTML = "\n                <td>".concat(employee.id, "</td>\n                <td>").concat(employee.name, "</td>\n                <td>").concat(employee.position, "</td>\n                <td>\n                    <button onclick=\"viewEmployee('").concat(employee.id, "')\">View</button>\n                </td>\n            ");
        tbody.appendChild(row);
    });
}
function showEmployeeList() {
    document.getElementById("employee-list").classList.remove("hidden");
    document.getElementById("employee-details").classList.add("hidden");
    document.getElementById("employee-form").classList.add("hidden");
}
function viewEmployee(id) {
    selectedEmployee = employees.find(function (emp) { return emp.id === id; }) || null;
    if (selectedEmployee) {
        document.getElementById("detail-id").textContent = selectedEmployee.id;
        document.getElementById("detail-name").textContent = selectedEmployee.name;
        document.getElementById("detail-position").textContent = selectedEmployee.position;
        document.getElementById("employee-list").classList.add("hidden");
        document.getElementById("employee-details").classList.remove("hidden");
    }
}
function showAddEmployeeForm() {
    selectedEmployee = null;
    document.getElementById("form-title").textContent = "Add Employee";
    document.getElementById("employee-id").value = "";
    document.getElementById("employee-name").value = "";
    document.getElementById("employee-position").value = "";
    document.getElementById("employee-list").classList.add("hidden");
    document.getElementById("employee-form").classList.remove("hidden");
}
function saveEmployee(event) {
    event.preventDefault();
    var id = document.getElementById("employee-id").value;
    var name = document.getElementById("employee-name").value;
    var position = document.getElementById("employee-position").value;
    if (selectedEmployee) {
        // Edit existing employee
        selectedEmployee.id = id;
        selectedEmployee.name = name;
        selectedEmployee.position = position;
    }
    else {
        // Add new employee
        employees.push({ id: id, name: name, position: position });
    }
    saveToLocalStorage(); // Save changes
    renderEmployeeList();
    showEmployeeList();
}
function editEmployee() {
    if (selectedEmployee) {
        document.getElementById("form-title").textContent = "Edit Employee";
        document.getElementById("employee-id").value = selectedEmployee.id;
        document.getElementById("employee-name").value = selectedEmployee.name;
        document.getElementById("employee-position").value = selectedEmployee.position;
        document.getElementById("employee-details").classList.add("hidden");
        document.getElementById("employee-form").classList.remove("hidden");
    }
}
function deleteEmployee() {
    if (selectedEmployee) {
        var index = employees.findIndex(function (emp) { return emp.id === selectedEmployee.id; });
        employees.splice(index, 1);
        saveToLocalStorage(); // Save changes
        renderEmployeeList();
        showEmployeeList();
    }
}
// Initial Render
renderEmployeeList();
