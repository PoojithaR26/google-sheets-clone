document.addEventListener("DOMContentLoaded", function () {
    const rows = 10;
    const cols = 10;
    const table = document.getElementById("spreadsheet");
    const thead = table.querySelector("thead tr");
    const tbody = table.querySelector("tbody");

    // Create column headers (A, B, C...)
    thead.innerHTML = "<th></th>";
    for (let col = 0; col < cols; col++) {
        let th = document.createElement("th");
        th.textContent = String.fromCharCode(65 + col);
        thead.appendChild(th);
    }

    // Create table body with row numbers
    tbody.innerHTML = "";
    for (let row = 1; row <= rows; row++) {
        let tr = document.createElement("tr");
        let rowHeader = document.createElement("th");
        rowHeader.textContent = row;
        tr.appendChild(rowHeader);

        for (let col = 0; col < cols; col++) {
            let td = document.createElement("td");
            td.contentEditable = "true";
            td.id = `${String.fromCharCode(65 + col)}${row}`;
            td.draggable = true;

            // Multi-cell selection
            td.addEventListener("mousedown", () => {
                isMouseDown = true;
                clearSelection();
                selectCell(td);
            });
            td.addEventListener("mouseenter", () => {
                if (isMouseDown) selectCell(td);
            });

            // Click to select
            td.addEventListener("click", () => {
                selectedCell = td;
            });

            // Drag-and-Drop Events
            td.addEventListener("dragstart", handleDragStart);
            td.addEventListener("dragover", handleDragOver);
            td.addEventListener("drop", handleDrop);

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    document.addEventListener("mouseup", () => (isMouseDown = false));

    // Global Variables
    let selectedCell = null;
    let isMouseDown = false;
    let selectedCells = new Set();

    // Function: Multi-cell Selection
    function selectCell(cell) {
        selectedCells.add(cell);
        cell.style.backgroundColor = "#d0eaff";
    }

    function clearSelection() {
        selectedCells.forEach((cell) => (cell.style.backgroundColor = ""));
        selectedCells.clear();
    }

    // Function: Drag & Drop
    function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.textContent);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        event.target.textContent = data;
    }

    // Function: Format Text
    function formatText(style) {
        if (!selectedCell) return;
        if (style === "bold") {
            selectedCell.style.fontWeight = selectedCell.style.fontWeight === "bold" ? "normal" : "bold";
        } else if (style === "italic") {
            selectedCell.style.fontStyle = selectedCell.style.fontStyle === "italic" ? "normal" : "italic";
        } else if (style === "uppercase") {
            selectedCell.textContent = selectedCell.textContent.toUpperCase();
        } else if (style === "lowercase") {
            selectedCell.textContent = selectedCell.textContent.toLowerCase();
        }
    }

    // Function: Find and Replace
    function findAndReplace(findText, replaceText) {
        document.querySelectorAll("td").forEach(cell => {
            if (cell.textContent.includes(findText)) {
                cell.textContent = cell.textContent.replaceAll(findText, replaceText);
            }
        });
    }

    // Function: Apply Formula
    function applyFormula() {
        const input = document.getElementById("formula-input").value.trim();
        if (!input || !selectedCell) return;
        const match = input.match(/(SUM|AVERAGE|MAX|MIN|COUNT)\((.*)\)/i);
        if (!match) return alert("Invalid formula!");

        const operation = match[1].toUpperCase();
        const range = match[2];
        const [start, end] = range.split(":");

        if (!start || !end) return alert("Invalid range!");
        const startRow = parseInt(start.match(/\d+/)[0]);
        const endRow = parseInt(end.match(/\d+/)[0]);
        const column = start.charAt(0);

        let values = [];
        for (let i = startRow; i <= endRow; i++) {
            let cell = document.getElementById(`${column}${i}`);
            if (cell && !isNaN(cell.textContent)) {
                values.push(parseFloat(cell.textContent));
            }
        }

        let result = 0;
        switch (operation) {
            case "SUM": result = values.reduce((a, b) => a + b, 0); break;
            case "AVERAGE": result = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0; break;
            case "MAX": result = Math.max(...values); break;
            case "MIN": result = Math.min(...values); break;
            case "COUNT": result = values.length; break;
            default: return;
        }
        selectedCell.textContent = result;
    }

    // Undo/Redo Functionality
    let history = [], redoStack = [];
    function saveState() {
        history.push(table.innerHTML);
        redoStack = [];
    }

    function undo() {
        if (history.length) {
            redoStack.push(table.innerHTML);
            table.innerHTML = history.pop();
        }
    }

    function redo() {
        if (redoStack.length) {
            history.push(table.innerHTML);
            table.innerHTML = redoStack.pop();
        }
    }

    // Export & Import CSV
    function exportCSV() {
        let csv = "";
        document.querySelectorAll("tr").forEach(row => {
            let rowData = [];
            row.querySelectorAll("th, td").forEach(cell => rowData.push(cell.textContent));
            csv += rowData.join(",") + "\n";
        });
        let blob = new Blob([csv], { type: "text/csv" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "spreadsheet.csv";
        a.click();
    }
    function importCSV(event) {
        let file = event.target.files[0];
        if (!file) return;
    
        let reader = new FileReader();
        reader.onload = function (e) {
            let csvData = e.target.result;
            loadCSV(csvData);
        };
        reader.readAsText(file);
    }
    
    function loadCSV(csv) {
        const rows = csv.trim().split("\n").map(row => row.split(","));
        const table = document.getElementById("spreadsheet").querySelector("tbody");
    
        // Ensure the table has enough rows
        while (table.rows.length < rows.length) {
            let tr = document.createElement("tr");
            let rowHeader = document.createElement("th");
            rowHeader.textContent = table.rows.length + 1;
            tr.appendChild(rowHeader);
    
            for (let col = 0; col < rows[0].length; col++) {
                let td = document.createElement("td");
                td.contentEditable = "true";
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    
        // Populate the table with CSV data
        for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < rows[r].length; c++) {
                let cell = table.rows[r]?.cells[c + 1]; // Skip row number
                if (cell) {
                    cell.textContent = rows[r][c].trim();
                }
            }
        }
    }
    
    // Attach Event Listeners
    document.getElementById("importCSV").addEventListener("click", () => {
        document.getElementById("csvFileInput").click();
    });
    document.getElementById("csvFileInput").addEventListener("change", importCSV);
    

    // Event Listeners for CSV Import & Export
    document.getElementById("exportCSV").addEventListener("click", exportCSV);
    document.getElementById("csvFileInput").addEventListener("change", importCSV);
});
