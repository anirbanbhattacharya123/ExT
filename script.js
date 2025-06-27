// Expense Tracker Application
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const expenseForm = document.getElementById('expenseForm');
            const expenseList = document.getElementById('expenseList');
            const totalAmountElement = document.getElementById('totalAmount');
            const clearAllButton = document.getElementById('clearAll');
            
            // Category totals
            const categoryTotals = {
                'Food': document.getElementById('foodTotal'),
                'Transport': document.getElementById('transportTotal'),
                'Bills': document.getElementById('billsTotal'),
                'Shopping': document.getElementById('shoppingTotal'),
                'Entertainment': document.getElementById('entertainmentTotal'),
                'EMI': document.getElementById('emiTotal'),
                'Investment': document.getElementById('investmentTotal'),
                'Other': document.getElementById('otherTotal')
            };
            
            // Initialize expenses array from localStorage or empty array
            let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            
            // Set today's date as default
            document.getElementById('date').valueAsDate = new Date();
            
            // Render expenses on page load
            renderExpenses();
            updateSummary();
            
            // Form submission
            expenseForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const description = document.getElementById('description').value;
                const amount = parseFloat(document.getElementById('amount').value);
                const category = document.getElementById('category').value;
                const date = document.getElementById('date').value;
                
                // Create new expense object
                const expense = {
                    id: Date.now(), // Unique ID based on timestamp
                    description,
                    amount,
                    category,
                    date
                };
                
                // Add to expenses array
                expenses.push(expense);
                
                // Save to localStorage
                localStorage.setItem('expenses', JSON.stringify(expenses));
                
                // Update UI
                renderExpenses();
                updateSummary();
                
                // Reset form
                expenseForm.reset();
                document.getElementById('date').valueAsDate = new Date();
            });
            
            // Clear all expenses
            clearAllButton.addEventListener('click', function() {
                if (expenses.length === 0) {
                    alert("What will you delete now ??");
                    return;
                }
                else if (confirm('Are you sure you want to clear all expenses?')) {
                    expenses = [];
                    localStorage.setItem('expenses', JSON.stringify(expenses));
                    renderExpenses();
                    updateSummary();
                }
            });
            
            // Render expenses list
            function renderExpenses() {
                // Clear existing list
                expenseList.innerHTML = '';
                
                if (expenses.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="5" class="empty-message">No expenses recorded yet</td>
                    `;
                    expenseList.appendChild(row);
                    return;
                }
                
                // Sort expenses by date (newest first)
                expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Add each expense to the table
                expenses.forEach(expense => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formatDate(expense.date)}</td>
                        <td>${expense.description}</td>
                        <td>
                            <span class="category-badge ${getCategoryBadgeClass(expense.category)}">
                                ${expense.category}
                            </span>
                        </td>
                        <td>₹${formatINR(expense.amount)}</td>
                        <td>
                            <button onclick="deleteExpense(${expense.id})" class="action-button delete-button">Delete</button>
                        </td>
                    `;
                    expenseList.appendChild(row);
                });
            }
            
            // Update summary totals
            function updateSummary() {
                const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                document.getElementById('totalAmount').textContent = formatINR(total);
                
                // Reset all category totals
                Object.keys(categoryTotals).forEach(category => {
                    categoryTotals[category].textContent = '0';
                });
                
                // Calculate category totals
                expenses.forEach(expense => {
                    if (categoryTotals[expense.category]) {
                        const current = parseFloat(categoryTotals[expense.category].textContent.replace(/,/g, '')) || 0;
                        categoryTotals[expense.category].textContent = formatINR(current + expense.amount);
                    }
                });
            }
            
            // Format currency in Indian Rupees with commas
            function formatINR(amount) {
                return new Intl.NumberFormat('en-IN', {
                    maximumFractionDigits: 0
                }).format(amount);
            }
            
            // Format date for display
            function formatDate(dateString) {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            }
            
            // Get badge class for category
            function getCategoryBadgeClass(category) {
                switch(category) {
                    case 'Food': return 'badge-food';
                    case 'Transport': return 'badge-transport';
                    case 'Bills': return 'badge-bills';
                    case 'Shopping': return 'badge-shopping';
                    case 'Entertainment': return 'badge-entertainment';
                    case 'EMI': return 'badge-emi';
                    case 'Investment': return 'badge-investment';
                    default: return 'badge-other';
                }
            }
        });
        
        // Delete expense (needs to be global for the inline onclick to work)
        function deleteExpense(id) {
            let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            if (expenses.length === 0) {
                alert("What do you want to Delete ??");
                return;
            }
            expenses = expenses.filter(expense => expense.id !== id);
            localStorage.setItem('expenses', JSON.stringify(expenses));

            // Re-render
            document.getElementById('expenseList').innerHTML = '';
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);
        }