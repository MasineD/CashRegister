// ===========Getting data from the HTML==========
const itemPrice = document.getElementById("itemPrice");
const drawer = document.querySelector(".drawer");
const purchaseBtn = document.getElementById("purchase-btn");
const drwBtn =document.getElementById("drwBtn");
const userInput = document.getElementById("cash");
const changeDue = document.getElementById('change-due');

// ===========Default values provided============
let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

// ==========Processing the data from HTML==========

// =========Sending back the output to the HTML=======
itemPrice.textContent = `$${price}`;

// ======Create a table for the drawer=========
const headers = [];
cid.forEach(el=>{
  headers.push(el[0]);
})
let data = [];
cid.forEach(el=>{
  data.push(el[1]);
})

// ==========Table============
const table = document.createElement('table');
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
// Create tbody
const tbody = document.createElement('tbody');
const row = document.createElement('tr');
table.style.borderCollapse = 'collapse';
table.style.width = '100%';
table.style.height = '100%';
table.style.display = 'none'

headers.forEach(elmnt => {
  const th = document.createElement('th');
  th.textContent = elmnt;
  th.style.border = '1px solid #333';
  th.style.padding = '8px';
  th.style.backgroundColor = '#f2f2f2';
  headerRow.appendChild(th);
});

thead.appendChild(headerRow);
table.appendChild(thead);


data.forEach(rowElem => {
  
  const td = document.createElement('td');
  td.textContent = rowElem;
  td.style.border = '1px solid #333';
  td.style.justifyContent = 'center';
  row.appendChild(td);
  tbody.appendChild(row);
});
// ==========Add the table to the DOM=========
table.appendChild(tbody);
drawer.appendChild(table);
// -----------Handle clicking of the Open Button--------------
drwBtn.addEventListener('click',()=>{
  // If OPEN, display the drawer and change the text to CLOSE
  if(drwBtn.textContent.toLocaleLowerCase() === "open drawer"){
    table.style.display = 'table'
    drwBtn.textContent = "CLOSE DRAWER";
  }
  // If CLOSE, remove the drawer and change the text to OPEN
  else{
    table.style.display = 'none'
    drwBtn.textContent = "OPEN DRAWER";
  }
})
// ==================Process the price and output the change to the screen.===========
function processInput(price, cid) {
  const inputValue = parseFloat(userInput.value);
  const changeDueAmount = parseFloat((inputValue - price).toFixed(2));
  const totalInDrawer = parseFloat(cid.reduce((sum, [, amount]) => sum + amount, 0).toFixed(2));

  if (inputValue < price) {
    alert("Customer does not have enough money to purchase the item");
  }
  else if(inputValue === price){
    changeDue.textContent = "No change due - customer paid with exact cash";
    return;
  }
  else if(changeDueAmount > totalInDrawer){
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }
  else if (changeDueAmount === totalInDrawer) {
  const formattedChange = cid
    .filter(([_, amount]) => amount > 0)
    .reverse()
    .map(([name, amount]) => `${name}: $${amount.toFixed(2)}`)
    .join(', ');
  changeDue.textContent = `Status: CLOSED${formattedChange ? ' ' + formattedChange : ''}`;
  return;
  }
  
  const currencyUnits = {
    'PENNY': 0.01,
    'NICKEL': 0.05,
    'DIME': 0.10,
    'QUARTER': 0.25,
    'ONE': 1.00,
    'FIVE': 5.00,
    'TEN': 10.00,
    'TWENTY': 20.00,
    'ONE HUNDRED': 100.00
  };

  let remainingChange = changeDueAmount;
  const changeArr = [];

  for (let i = cid.length - 1; i >= 0; i--) {
    const [name, total] = cid[i];
    const unit = currencyUnits[name];
    let availableUnits = Math.floor(total / unit);
    let amountToReturn = 0;

    while (remainingChange >= unit && availableUnits > 0) {
      remainingChange = parseFloat((remainingChange - unit).toFixed(2));
      amountToReturn += unit;
      availableUnits--;
    }

    if (amountToReturn > 0) {
      changeArr.push([name, parseFloat(amountToReturn.toFixed(2))]);
      cid[i][1] = parseFloat((cid[i][1] - amountToReturn).toFixed(2)); // Update drawer
    }
  }

  if (remainingChange > 0) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  } else {
    const formattedChange = changeArr.map(([name, amt]) => `${name}: $${amt}`).join(', ');
    table.style.display = 'table'
    drwBtn.textContent = "CLOSE DRAWER";
    changeDue.textContent = `Status: OPEN ${formattedChange}`;
    return;
  }
}
purchaseBtn.addEventListener('click', () => processInput(price, cid));
