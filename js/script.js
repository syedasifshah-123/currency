const fromSelect = document.querySelector(".from .select-box");
const toSelect = document.querySelector(".to .select-box");
const drawer = document.querySelector(".drawer");
const drawerClose = document.querySelectorAll("[data-drawer-toggler]");
const codeName = document.querySelectorAll(".code-name");

const exchangeRateBtn = document.querySelector("#exchange-rate");

function showDrawer() { drawer.classList.add("show"); }
function hideDrawer() { drawer.classList.remove("show"); }
drawerClose.forEach((dClose) => { 
    dClose.addEventListener("click", hideDrawer);
});


// data

let htmlContent = "";

for (let currency in country_list) {

    let countryCode = country_list[currency].code.toLowerCase();
    let countryName = country_list[currency].name;
    if (countryCode === "an") { countryCode = "nl"; }

    htmlContent += `
        <li data-drawer-toggler data-filter-item data-code="${countryCode}" data-currency="${currency}" data-name="${countryName}">
            <img src="https://flagcdn.com/w320/${countryCode}.png" alt="Flag of ${countryName}">
            <div>
                <h4>${currency}</h4>
                <p>${countryName}</p>
            </div>
        </li>
    `;
    
}

document.querySelector(".country-list").innerHTML = htmlContent;

let selectedBox = null;
fromSelect.addEventListener('click', function() {
    selectedBox = 'from'; 
    showDrawer();
});

toSelect.addEventListener('click', function() {
    selectedBox = 'to';
    showDrawer();
});


function handleCurrencySelection() {

    const code = this.getAttribute('data-code');
    const currency = this.getAttribute('data-currency');
    const name = this.getAttribute('data-name');

    if (selectedBox === 'from') {

        const img = fromSelect.querySelector('.img-cover img');
        const codeName = fromSelect.querySelector('.code-name');
        
        if (img && codeName) {
            img.src = `https://flagcdn.com/w320/${code}.png`;
            img.alt = `Flag of ${name}`;
            codeName.textContent = currency;
        } 
    } else if (selectedBox === 'to') {

        const img = toSelect.querySelector('.img-cover img');
        const codeName = toSelect.querySelector('.code-name');
        
        if (img && codeName) {
            img.src = `https://flagcdn.com/w320/${code}.png`;
            img.alt = `Flag of ${name}`;
            codeName.textContent = currency;
        }

    }

    hideDrawer();  
}

document.querySelectorAll('[data-drawer-toggler]').forEach(item => {
    item.addEventListener('click', handleCurrencySelection);
});



// Call API

const fromInput = document.querySelector(".from-input");
const toInput = document.querySelector(".to-input");
const exchangeRateText = document.querySelector(".exchange-text");

window.addEventListener("load", function () {
    getExchangeRate();
});

function getExchangeRate() {
    
    let amountVal = fromInput.value;
    if (amountVal === "" || amountVal === "0") {
        fromInput.value = "1"; 
        amountVal = 1;
    }

    let fromCurrency = fromSelect.querySelector(".code-name").textContent.trim(); 
    let toCurrency = toSelect.querySelector(".code-name").textContent.trim();     

    let apiKey = "be6a6151ec7f97f4a4797003";
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
    exchangeRateText.innerText = "Getting exchange rate...";

    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency];
            let totalExchangerate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateText.innerText = `${amountVal} ${fromCurrency} = ${totalExchangerate} ${toCurrency}`;
            toInput.value = totalExchangerate;
        })
        .catch(() => { 
            exchangeRateText.innerText = "Something went wrong!";
        });

}

fromInput.addEventListener("input", getExchangeRate);
exchangeRateBtn.addEventListener("click", getExchangeRate);


// Filter Section

const filterInput = document.querySelector("[data-filter-input]");
const filterItem = document.querySelectorAll("[data-filter-item]");

filterInput.addEventListener("input", function () { 
    const filterVal = filterInput.value.toLowerCase();

    filterItem.forEach((item) => { 
        if (item.textContent.toLocaleLowerCase().includes(filterVal)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
});
