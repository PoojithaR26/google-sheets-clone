# 📊 Google Sheets Clone

A lightweight **web-based spreadsheet application** that mimics **Google Sheets** with essential features like **cell formatting, formulas, CSV import/export, and multi-cell selection**.  

🔹 **Edit and format cells**  
🔹 **Apply formulas like SUM, AVERAGE, MAX, etc.**  
🔹 **Import/export CSV files**  
🔹 **Undo/Redo changes**  
🔹 **Multi-cell selection (Excel-like drag feature)**  

---

## ✨ Features

### ✅ **Spreadsheet Interface**
📌 Click & edit individual cells  
📌 Click & drag to select multiple cells (Excel-like selection)  
📌 Drag & drop to copy cell data  

### 🎨 **Cell Formatting**
🎯 **Bold, Italic, Uppercase, Lowercase**  

### ➕ **Mathematical Formulas**
🧮 Supports the following formulas:  
- `SUM(A1:A3)`: ➕ Adds values in the range  
- `AVERAGE(A1:A3)`: 📊 Computes average  
- `MAX(A1:A3)`: 🔼 Finds max value  
- `MIN(A1:A3)`: 🔽 Finds min value  
- `COUNT(A1:A3)`: 🔢 Counts numeric values  

### 🔍 **Data Management**
📝 **Find & Replace** any text in the sheet  
♻️ **Undo/Redo Support**  

### 📂 **CSV Import/Export**
📥 **Import `.csv` files** into the spreadsheet  
📤 **Export spreadsheet data** as `.csv`  

---

## 🚀 Getting Started

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/yourusername/google-sheets-clone.git
cd google-sheets-clone
```
### 2️⃣ **Run Locally**
```sh
# Open index.html in your browser
start index.html  # For Windows

open index.html   # For Mac

xdg-open index.html  # For Linux
```
### 📂 Project Structure
```sh
google-sheets-clone/
│── index.html       # Main UI structure
│── styles.css       # Styling for the spreadsheet
│── script.js        # Functionality (formulas, formatting, CSV handling)
└── README.md        # Project documentation
```
