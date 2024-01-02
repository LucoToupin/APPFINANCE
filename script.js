"use strict";
const income_List = document.getElementById('income_List');
const expense_List = document.getElementById('expense_List');
const IEInput = document.getElementById('itemDropdown');
const itemsPresence = new Set();
let totalIncome = 0;
let totalExpense = 0;
// List of items in Dropdownitem
const itemsDropdown = [
    { name: 'Salary', type: 'income' },
    { name: 'Allocation', type: 'income' },
    { name: 'Bills', type: 'expense' },
    { name: 'Rent', type: 'expense' },
    { name: 'Food', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
];
// Function to populate the dropdown list
function populateDropdownList() {
    const dropdown = document.getElementById('itemDropdown');
    // Clear existing options
    dropdown.innerHTML = '';
    // Add default
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Make a choice';
    dropdown.add(defaultOption);
    // Add items
    itemsDropdown.forEach((item) => {
        const option = document.createElement('option');
        option.text = item.name;
        option.value = item.type;
        dropdown.add(option);
    });
}
function populateDropdownListDate() {
    const dateDropdown = document.getElementById('Dates');
    const startDate = new Date(2020, 0, 1);
    const endDate = new Date(2030, 12, 31);
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dateValue = document.createElement('option');
        dateValue.value = formatDate(currentDate);
        dateValue.text = formatDate(currentDate);
        dateDropdown.add(dateValue);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}
function formatDate(date) {
    const year = date.getFullYear().toString();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
// Event listener for when the page loads
window.addEventListener('load', () => {
    // Populate the dropdown list
    populateDropdownList();
    populateDropdownListDate();
});
function addIncomeOrExpense() {
    const IEtext = IEInput.options[IEInput.selectedIndex].text.trim(); // Assuming the value is the type
    const selectedType = IEInput.value; // Assuming the value is the type
    if (itemsPresence.has(IEtext)) {
        return;
    }
    if (selectedType === 'income') {
        const li_income = document.createElement('li');
        li_income.setAttribute('data-type', 'income');
        income_List.appendChild(li_income);
        const ItemTypeSpan = document.createElement('span');
        ItemTypeSpan.id = 'type';
        ItemTypeSpan.textContent = IEtext;
        li_income.appendChild(ItemTypeSpan);
        const ItemValueCAD = document.createElement('input');
        ItemValueCAD.type = 'string';
        ItemValueCAD.placeholder = '0.00';
        ItemValueCAD.value = '0.00';
        li_income.appendChild(ItemValueCAD);
        const ItemValueCADTotal = document.createElement('input');
        ItemValueCADTotal.id = 'incomeTotal';
        ItemValueCADTotal.type = 'string';
        ItemValueCADTotal.readOnly = true;
        ItemValueCADTotal.placeholder = '0.00';
        ItemValueCADTotal.value = '0.00';
        li_income.appendChild(ItemValueCADTotal);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', deleteIncome);
        li_income.appendChild(deleteBtn);
        ItemValueCAD.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                // Parse the entered value as a number
                const enteredValue = parseFloat(event.target.value);
                if (!isNaN(enteredValue)) {
                    // Update ItemValueCADTotal
                    const currentTotal = parseFloat(ItemValueCADTotal.value);
                    ItemValueCADTotal.value = (currentTotal + enteredValue).toFixed(2) + ' $';
                    updateGraph();
                    // Reset ItemValueCAD to 0
                    ItemValueCAD.value = '0.00';
                    console.log(ItemValueCADTotal.value);
                    saveElementLocaly();
                }
            }
        });
    }
    else if (selectedType === 'expense') {
        const li_expense = document.createElement('li');
        li_expense.setAttribute('data-type', 'expense');
        expense_List.appendChild(li_expense);
        const ItemTypeSpan = document.createElement('span');
        ItemTypeSpan.id = 'type';
        ItemTypeSpan.textContent = IEtext;
        li_expense.appendChild(ItemTypeSpan);
        const ItemValueCAD = document.createElement('input');
        ItemValueCAD.type = 'string';
        ItemValueCAD.placeholder = '0.00';
        ItemValueCAD.value = '0.00';
        li_expense.appendChild(ItemValueCAD);
        const ItemValueCADTotal = document.createElement('input');
        ItemValueCADTotal.id = 'expenseTotal';
        ItemValueCADTotal.type = 'string';
        ItemValueCADTotal.readOnly = true;
        ItemValueCADTotal.placeholder = '0.00';
        ItemValueCADTotal.value = '0.00';
        li_expense.appendChild(ItemValueCADTotal);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', deleteExpense);
        li_expense.appendChild(deleteBtn);
        ItemValueCAD.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                // Parse the entered value as a number
                const enteredValue = parseFloat(ItemValueCAD.value);
                if (!isNaN(enteredValue)) {
                    // Update ItemValueCADTotal
                    const currentTotal = parseFloat(ItemValueCADTotal.value);
                    ItemValueCADTotal.value = (currentTotal + enteredValue).toFixed(2) + ' $';
                    updateGraph();
                    // Reset ItemValueCAD to 0
                    ItemValueCAD.value = '0.00';
                    console.log(ItemValueCADTotal.value);
                    saveElementLocaly();
                }
            }
        });
    }
    itemsPresence.add(IEtext);
    updateGraph();
    saveElementLocaly();
}
function deleteIncome(event) {
    const income = event.target.parentElement;
    if (income) {
        const IEtext = IEInput.options[IEInput.selectedIndex].text.trim(); // Assuming the value is the type
        const inputElement = income.querySelector('input#incomeTotal');
        const deletedValue = parseFloat(inputElement.value);
        income_List.removeChild(income);
        itemsPresence.delete(IEtext);
        totalIncome -= deletedValue;
        updateGraph();
        saveElementLocaly();
    }
}
function deleteExpense(event) {
    const expense = event.target.parentElement;
    if (expense) {
        const IEtext = IEInput.options[IEInput.selectedIndex].text.trim(); // Assuming the value is the type
        const inputElement = expense.querySelector('input#expenseTotal');
        const deletedValue = parseFloat(inputElement.value);
        expense_List.removeChild(expense);
        itemsPresence.delete(IEtext);
        totalExpense -= deletedValue;
        updateGraph();
        saveElementLocaly();
    }
}
const elemGraph = document.getElementById('graphs');
const graph = new Chart(elemGraph, {
    type: 'bar',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
                label: 'Total',
                data: [0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
function updateGraph() {
    console.log('Updating graph...');
    console.log(income_List.querySelectorAll('li'));
    income_List.querySelectorAll('li').forEach((li) => {
        const type = li.getAttribute('data-type');
        let inputElement = li.querySelector('input[type="string"]');
        console.log('Income LI:', li);
        console.log('Type:', type);
        console.log('InputElement:', inputElement);
        console.log('inputElement.value:', inputElement.value);
        if (inputElement && !isNaN(parseFloat(inputElement.value)) && type === 'income') {
            totalIncome += parseFloat(inputElement.value);
        }
    });
    expense_List.querySelectorAll('li').forEach((li) => {
        const type = li.getAttribute('data-type');
        let inputElement = li.querySelector('input[type="string"]');
        console.log('Expense LI:', li);
        console.log('Type:', type);
        console.log('InputElement:', inputElement);
        console.log('inputElement.value:', inputElement.value);
        if (inputElement && !isNaN(parseFloat(inputElement.value)) && type === 'expense') {
            totalExpense += parseFloat(inputElement.value);
        }
    });
    console.log('Total Income:', totalIncome);
    console.log('Total Expense:', totalExpense);
    if (graph.data) {
        graph.data.datasets[0].data = [totalIncome, totalExpense];
        graph.update();
    }
}
function saveElementLocaly() {
    const listIncomes = [];
    const listIncomesItems = income_List.getElementsByTagName('li');
    const listExpenses = [];
    const listExpenseItems = expense_List.getElementsByTagName('li');
    for (let i = 0; i < listIncomesItems.length; i++) {
        const typeSpan = listIncomesItems[i].querySelector('#type');
        const textContent = typeSpan.textContent;
        if (textContent !== null) {
            const trimmedText = textContent.trim();
            if (trimmedText !== 'Make a choice' && !listIncomes.includes(trimmedText)) {
                listIncomes.push(trimmedText);
            }
        }
    }
    for (let i = 0; i < listExpenseItems.length; i++) {
        const textContent = listExpenseItems[i].textContent;
        if (textContent !== null) {
            const trimmedText = textContent.trim();
            if (trimmedText !== 'Make a choice' && !listExpenses.includes(trimmedText)) {
                listIncomes.push(trimmedText);
            }
        }
    }
    localStorage.setItem('incomes', JSON.stringify(listIncomes));
    localStorage.setItem('expenses', JSON.stringify(listExpenses));
}
function loadElementLocaly() {
    const listIncomes = (localStorage.getItem('incomes'));
    const listExpenses = (localStorage.getItem('expenses'));
    console.log('listIncomes', listIncomes);
    console.log('listExpenses', listExpenses);
    localStorage.setItem('incomes', '');
    localStorage.setItem('expenses', '');
    const typeOf = typeof (listIncomes);
    console.log(typeOf);
    if (listIncomes && listExpenses) {
        const arrayIncomes = JSON.parse(listIncomes);
        const arrayExpenses = JSON.parse(listExpenses);
        const arraytype = typeof (arrayIncomes);
        console.log(arraytype);
        if (Array.isArray(arrayIncomes)) {
            arrayIncomes.forEach((tasktext) => {
                const li = document.createElement('li');
                li.textContent = tasktext;
                income_List.appendChild(li);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', deleteIncome);
                li.appendChild(deleteBtn);
            });
        }
        if (Array.isArray(arrayExpenses)) {
            arrayExpenses.forEach((tasktext) => {
                const li = document.createElement('li');
                li.textContent = tasktext;
                expense_List.appendChild(li);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', deleteExpense);
                li.appendChild(deleteBtn);
            });
        }
    }
}
loadElementLocaly();
