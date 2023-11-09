let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");

let tempAmount = 0;

//Set Budget Part
totalAmountButton.addEventListener("click", () => {
    tempAmount = totalAmount.value; 
    //empty or negative input
    if (tempAmount === "" || tempAmount < 0) {
        errorMessage.classList.remove("hide");

    } else {
        errorMessage.classList.add("hide");
        //set Budget
        amount.innerHTML = tempAmount;
        //set balance
        balanceValue.innerText = tempAmount - expenditureValue.innerText;
        //clear input box
        totalAmount.value = " ";
    }
});

//function to disable edit and delete button
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach(element => {
        element.disabled = bool;
    });
};

//modify list elements
const modifyElement = (element,edit=false) => {
    let parentDiv = element.parentElement;
    let currentBalance = balanceValue.innerText;
    let currentExpense = expenditureValue.innerText;
    let parentAmount = parentDiv.querySelector(".amount").innerText;
    if (edit) {
        let parentText = parentDiv.querySelector(".product").innerText;
        productTitle.value = parentText;
        userAmount.value = parentAmount;
        disableButtons(true);
    }
    balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
    expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);
    parentDiv.remove();
};

//create list
const listCreator = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    list.appendChild(sublistContent);
    sublistContent.innerHTML = `<p class ="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "24px";
    editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
    deleteButton.style.fontSize = "24px";
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
    });
    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
    document.getElementById("list").appendChild(sublistContent);

};

//To add Expenses
checkAmountButton.addEventListener("click", () => {
    if (!userAmount.value || !productTitle.value) {
        productTitleError.classList.remove("hide");
        return false;
    }

    //buttons
    disableButtons(false);
    //expense
    let expenditure = parseInt(userAmount.value);
    //total Expenses
    let sum = parseInt(expenditureValue.innerText) + expenditure;
    expenditureValue.innerText = sum;
    //total balance (budget - total-expense) 
    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance;
    //create a list
    listCreator(productTitle.value, userAmount.value);
    //empty inputs
    productTitle.value = "";
    userAmount.value = "";

});

// Function to create and update the spending chart
const createSpendingChart = (labels, data) => {
    const ctx = document.getElementById("spending-chart").getContext("2d");
    const spendingChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Spending",
                    data: data,
                    backgroundColor: ["red", "blue", "green"], // Customize colors as needed
                },
            ],
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Calendar Week',
                    },
                    ticks: {
                        callback: function (value, index) {
                            return 'Calendar Week ' + value;
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Spending',
                    },
                },
            },
            plugins: {
                legend: {
                    display: true, // Customize as needed
                },
            },
        },
    });

    // Define responsive settings
    spendingChart.options.plugins.legend.display = false; // Hide legend by default

    // Add responsive settings
    spendingChart.options.plugins.legend.legendCallback = function(chart) {
        return 'Week ' + chart.data.labels[0];
    };

    spendingChart.options.plugins.legend.reverse = false;

    // Set custom responsive rules
    spendingChart.options.plugins.legend.custom = function(context) {
        var width = context.chart.width;
        return width <= 640 ? 'W' : 'Week';
    };

    spendingChart.update();
};


// Function to generate budget data for export
const generateBudgetData = (budgetData) => {
    const totalAmount = budgetData.totalAmount;
    const categories = budgetData.categories;

    const expenditure = categories.reduce((sum, category) => sum + category.expenses, 0);
    const balance = totalAmount - expenditure;

    return {
        totalAmount,
        categories,
        expenditure,
        balance,
    };
};

// Update the chart and export link when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get budget data dynamically (replace this with your data retrieval)
    const budgetData = {
        totalAmount: 1000, // Replace with the actual total budget
        categories: [
            { name: "Category 1", expenses: 200 },
            { name: "Category 2", expenses: 350 },
            // Add more categories as needed
        ],
    };

    // Extract data for the chart
    const labels = budgetData.categories.map((category) => category.name);
    const data = budgetData.categories.map((category) => category.expenses);

    createSpendingChart(labels, data);

    // Add an event listener to the export link
    const exportLink = document.getElementById("download-link");
    exportLink.addEventListener("click", (e) => {
        e.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generateBudgetData(budgetData)));
    });
});


const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const List = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const category = document.getElementById('category');
const Amount = document.getElementById('amount');
const date = document.getElementById('date');
const type = document.getElementById('type');
const addIncomeBtn = document.getElementById('add-income-btn');
const addExpenseBtn = document.getElementById('add-expense-btn');
const noHistory = document.getElementById('no-history');
const toast = document.getElementById('toast');

let transactions = [];

// Show or hide income/expense buttons based on selection
function handleTransactionType() {
  const selectedType = type.value;
  category.style.display = selectedType === 'expense' ? 'block' : 'none';
  text.style.display = selectedType === 'income' ? 'block' : 'none';

  addIncomeBtn.style.display = selectedType === 'income' ? 'block' : 'none';
  addExpenseBtn.style.display = selectedType === 'expense' ? 'block' : 'none';
}

// Add transaction
function addTransaction(e, isIncome) {
  e.preventDefault();

  if (!(isIncome) && (category.value === '' || Amount.value.trim() === '' || date.value === '')) {
    alert('Please provide category, amount and date!');
    return;
  }else if (isIncome && (text.value.trim() === '' || Amount.value.trim() === '' || date.value === '')) {
    alert('Please provide Description, Amount, and Date!');
    return;
  }

  var bal = parseInt(balance.innerHTML.slice(1));

  if (!isIncome && (bal - Amount.value < 0)){
    alert("Insufficent Balance!");
    return;
  }

  const transaction = {
    text: isIncome ? text.value : category.value,
    amount: isIncome ? parseFloat(Amount.value) : -parseFloat(Amount.value),
    date: date.value,
  };

  fetch('/add_transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  })
    .then(response => response.json())
    .then(data => {
      addTransactionDOM(data.transaction);
      updateValues(data.transactions);
      text.value = '';
      amount.value = '';
      date.value = '';

      noHistory.style.display = 'none';

      addIncomeBtn.style.display = 'none';
      addExpenseBtn.style.display = 'none';
      text.style.display='none';
      category.style.display='none';

      category.value = '';
      type.value = '';

      showToast("Transaction added!", "add");
    })
    .catch(error => console.log('Error:', error));
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const { text, amount, date, transaction_id } = transaction;
  const sign = amount < 0 ? '-' : '+';
  const existingTransaction = transactions.find(t => t.transaction_id === transaction.transaction_id);

  if (!existingTransaction) {
    transactions.push(transaction);
  }

  const item = document.createElement('li');
  item.classList.add(amount < 0 ? 'minus' : 'plus');
  const dt = new Date(date).toLocaleDateString('en-GB');

  item.innerHTML = `
    ${text}
    <span class="date">${dt}</span>
    <span>${sign}${Math.abs(amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction_id})">x</button>
  `;

  List.appendChild(item);
}

// Remove transaction by ID
function removeTransaction(transactionId) {
  fetch(`/delete_transaction/${transactionId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      updateValues(data.transactions);
      showToast("Transaction removed!", "del");
      init();
    })
    .catch(error => {
      console.log('An error occurred while removing the transaction:', error);
    });
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => parseFloat(transaction.amount));
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balance.innerHTML = `&#8377;${total}`;
  money_plus.innerHTML = `&#8377;${income}`;
  money_minus.innerHTML = `&#8377;${expense}`;
}


// Filters the transactions 
function filterTransactions() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  fetch(`/get_transactions?start-date=${startDate}&end-date=${endDate}`)
    .then(response => response.json())
    .then(data => {
      list.innerHTML = '';

      if (data.transactions.length === 0) {
        noHistory.style.display = 'block';
      } else {
        noHistory.style.display = 'none';
        data.transactions.forEach(addTransactionDOM);
      }

      updateValues();
    })
    .catch(error => console.error('Error retrieving transactions:', error));
}

// To remove the filters and hide the options
function resetFilters() {
  document.getElementById('start-date').value = '';
  document.getElementById('end-date').value = '';
  document.getElementById('filter-form').style.display='none';
  init();
}

// shows filter options
function showFilterForm(){
  document.getElementById('filter-form').style.display='flex';
}

// Notification toast to inform when a transaction is added/removed
function showToast(message, type) {
  toast.textContent = message;
  toast.className = `toast ${type}`;

  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
  }, 1500);
}

// Bind event listeners
type.addEventListener('change', handleTransactionType);
addIncomeBtn.addEventListener('click', e => addTransaction(e, true));
addExpenseBtn.addEventListener('click', e => addTransaction(e, false));

function init() {
  list.innerHTML = '';
  fetch('/get_transactions')
    .then(response => response.json())
    .then(data => {
      transactions = data.transactions;

      if (transactions.length === 0) {
        noHistory.style.display = 'block';
      } else {
        noHistory.style.display = 'none';
        transactions.forEach(addTransactionDOM);
      }

      updateValues();
    })
    .catch(error => console.error('Error retrieving transactions:', error));
}

form.addEventListener('submit', e => {
  e.preventDefault();
});

init();
