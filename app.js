let data = { months:{} };
let currentMonth = "";

const CATEGORY_DEFAULT_BUDGETS = {
food:300000,
house: 400000,
transport:100000,
health: 30000,
shopping:150000,
entertainment:80000,
etc:50000
};

const PAYMENTS = ["card","cash","account"];



function init(){

loadData();

setCurrentMonth();

ensureMonth();

populateSelects();
setupNavigation();
setupMonthNavigation();
setupExpenseForm();
setupBudget();
setupExport();
setupImport();
setupDeleteMonth();

renderDashboard();
renderTransactions();
renderBudgetInputs();

}



function setCurrentMonth(){

const now = new Date();
currentMonth = now.toISOString().slice(0,7);

document.getElementById("currentMonth").textContent = currentMonth;

}



function changeMonth(offset){

const date = new Date(currentMonth + "-01");

date.setMonth(date.getMonth() + offset);

currentMonth = date.toISOString().slice(0,7);

document.getElementById("currentMonth").textContent = currentMonth;

ensureMonth();

renderDashboard();
renderTransactions();
renderBudgetInputs();

}



function setupMonthNavigation(){

document.getElementById("prevMonth")
.addEventListener("click",()=>changeMonth(-1));

document.getElementById("nextMonth")
.addEventListener("click",()=>changeMonth(1));

}



function ensureMonth(){

if(!data.months[currentMonth]){

data.months[currentMonth] = {
budgets:{ ...CATEGORY_DEFAULT_BUDGETS },
transactions:[]
};

}else{

const budgets = data.months[currentMonth].budgets;

Object.keys(CATEGORY_DEFAULT_BUDGETS).forEach(cat=>{
if(!(cat in budgets)){
budgets[cat] = CATEGORY_DEFAULT_BUDGETS[cat];
}
});

}

}



function getTransactions(){
return data.months[currentMonth].transactions;
}

function getBudgets(){
return data.months[currentMonth].budgets;
}



function populateSelects(){

const categorySelect = document.getElementById("category");
const paymentSelect = document.getElementById("payment");

Object.keys(CATEGORY_DEFAULT_BUDGETS).forEach(c=>{
const option=document.createElement("option");
option.value=c;
option.textContent=c;
categorySelect.appendChild(option);
});

PAYMENTS.forEach(p=>{
const option=document.createElement("option");
option.value=p;
option.textContent=p;
paymentSelect.appendChild(option);
});

}



function setupNavigation(){

document.querySelectorAll(".bottomNav button").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));

document.getElementById(btn.dataset.screen).classList.add("active");

});

});

}



function setupExpenseForm(){

const form = document.getElementById("expenseForm");

form.addEventListener("submit",(e)=>{

e.preventDefault();

const transaction={
id:Date.now(),
amount:Number(amount.value),
category:category.value,
payment:payment.value,
date:date.value,
memo:memo.value
};

getTransactions().push(transaction);

saveData();

renderTransactions();
renderDashboard();

form.reset();

});

}



function renderTransactions(){

const list=document.getElementById("transactionList");
list.innerHTML="";

const sorted=[...getTransactions()].sort((a,b)=>b.id-a.id);

sorted.forEach(t=>{

const row=document.createElement("tr");

row.innerHTML=`
<td>${t.date}</td>
<td>${t.category}</td>
<td>${t.amount}</td>
<td>${t.payment}</td>
<td>${t.memo || ""}</td>
<td><button class="deleteBtn" data-id="${t.id}">✕</button></td>
`;

list.appendChild(row);

});

document.querySelectorAll(".deleteBtn").forEach(btn=>{

btn.addEventListener("click",()=>{

const id=Number(btn.dataset.id);

data.months[currentMonth].transactions =
getTransactions().filter(t=>t.id!==id);

saveData();

renderTransactions();
renderDashboard();

});

});

}



function getCategoryExpense(category){

return getTransactions()
.filter(t=>t.category===category)
.reduce((sum,t)=>sum+t.amount,0);

}


function getTotalExpense(){

return getTransactions()
.reduce((sum,t)=>sum+t.amount,0);

}


function getTotalBudget(){

return Object.values(getBudgets())
.reduce((sum,b)=>sum+b,0);

}


function renderDashboard(){

const container=document.getElementById("budgetCards");
container.innerHTML="";

const totalExpense = getTotalExpense();
const totalBudget = getTotalBudget();

const percent = Math.min((totalExpense/totalBudget)*100,100);
const remaining = totalBudget - totalExpense;

const color = totalExpense > totalBudget ? "#ff4d4f" : "#4CAF50";

const totalCard=document.createElement("div");
totalCard.className="card";

totalCard.innerHTML=`
<h3>Total</h3>
<div>${totalExpense.toLocaleString()} / ${totalBudget.toLocaleString()}</div>
<div>Remaining: ${remaining.toLocaleString()}</div>

<div class="progress">
<div class="progressBar" style="width:${percent}%; background:${color}"></div>
</div>
`;

container.appendChild(totalCard);

container.appendChild(totalCard);

const budgets=getBudgets();

Object.keys(budgets).forEach(category=>{

const budget=budgets[category];
const expense=getCategoryExpense(category);

const percent=Math.min((expense/budget)*100,100);
const remaining=budget-expense;

const color = expense > budget ? "#ff4d4f" : "#4CAF50";

const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<h3>${category}</h3>
<div>${expense.toLocaleString()} / ${budget.toLocaleString()}</div>
<div>Remaining: ${remaining.toLocaleString()}</div>

<div class="progress">
<div class="progressBar" style="width:${percent}%; background:${color}"></div>
</div>
`;

container.appendChild(card);

});

}



function renderBudgetInputs(){

const container=document.getElementById("budgetInputs");
container.innerHTML="";

const budgets=getBudgets();

Object.keys(budgets).forEach(category=>{

const div=document.createElement("div");

div.className = "budgetRow";

div.innerHTML=`
<label>${category.charAt(0).toUpperCase() + category.slice(1)}</label>
<input type="number" id="budget-${category}" value="${budgets[category]}">
`;

container.appendChild(div);

});

}



function setupBudget(){

document.getElementById("saveBudget").addEventListener("click",()=>{

const budgets=getBudgets();

Object.keys(budgets).forEach(category=>{

const input=document.getElementById(`budget-${category}`);
budgets[category]=Number(input.value);

});

saveData();
renderDashboard();

});

}



function exportMonthJSON(){

const monthData=data.months[currentMonth];

const json=JSON.stringify(monthData,null,2);

const blob=new Blob([json],{type:"application/json"});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;
a.download=`budget-${currentMonth}.json`;

a.click();

URL.revokeObjectURL(url);

}



function setupExport(){

document.getElementById("exportMonth")
.addEventListener("click",exportMonthJSON);

}



function importMonthJSON(file){

const reader=new FileReader();

reader.onload=function(e){

const json=JSON.parse(e.target.result);

data.months[currentMonth]=json;

saveData();

renderDashboard();
renderTransactions();
renderBudgetInputs();

};

reader.readAsText(file);

}



function setupImport(){

document.getElementById("importMonth")
.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(file){
importMonthJSON(file);
}

});

}



function deleteCurrentMonth(){

if(confirm(`Delete data for ${currentMonth}?`)){

delete data.months[currentMonth];

saveData();

ensureMonth();

renderDashboard();
renderTransactions();
renderBudgetInputs();

}

}



function setupDeleteMonth(){

document.getElementById("deleteMonth")
.addEventListener("click",deleteCurrentMonth);

}



function saveData(){
localStorage.setItem("budgetAppData",JSON.stringify(data));
}

function loadData(){

const saved=localStorage.getItem("budgetAppData");

if(saved){
data=JSON.parse(saved);
}

}


function getTotalExpense(){

return getTransactions()
.reduce((sum,t)=>sum+t.amount,0);

}


init();
