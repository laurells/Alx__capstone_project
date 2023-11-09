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
