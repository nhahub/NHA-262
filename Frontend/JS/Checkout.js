const paymentSelect = document.querySelector('select[name="payment"]');
const cardInfo = document.getElementById('card-info');
const paypalDiv = document.getElementById('paypal');
const card = document.getElementById("myform");
  
  
  
paymentSelect.addEventListener('change', ()=>{
  if(paymentSelect.value==='card'){
      cardInfo.style.display='block';
  } else {
      cardInfo.style.display='none';
  }

  if(paymentSelect.value==='paypal'){
      paypalDiv.style.display='block';
  } else {
      paypalDiv.style.display='none';
  }
});



 fetch("https://countriesnow.space/api/v0.1/countries")
    .then(res => res.json())
    .then(data => {
      const countrySelect = document.getElementById("country");
      const citySelect = document.getElementById("city");

     
      data.data.forEach(countryObj => {
        const opt = document.createElement("option");
        opt.value = countryObj.country;
        opt.textContent = countryObj.country;
        countrySelect.appendChild(opt);
      });

      
      countrySelect.addEventListener("change", function(){
        const selected = data.data.find(c => c.country === this.value);
        citySelect.innerHTML = '<option hidden selected> Select City </option>';
        if (selected && selected.cities) {
          selected.cities.forEach(city => {
            const opt = document.createElement("option");
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
          });
        }
      });
    });
const form = document.getElementById("myform");
const successNotification = document.getElementById("successNotification");


document.querySelector('button[type="submit"]').addEventListener('click', function(e) {
  console.log("Submit button clicked!");
  e.preventDefault();
  showNotification();
});

form.addEventListener("submit", function(e) {
  e.preventDefault(); 
  console.log("Form submitted!"); 
  showNotification();
});

function showNotification() {
  successNotification.style.display = "block";
  successNotification.style.animation = "slideDown 0.3s ease-out";
  
  setTimeout(() => {
    successNotification.style.animation = "slideUp 0.3s ease-out";
    setTimeout(() => {
      successNotification.style.display = "none";
    }, 300);
  }, 3000);
}
 
    fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("countryCode");

      data.forEach(country => {
        const opt = document.createElement("option");
        const code = country.idd?.root
          ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "")
          : "";
        opt.value = code;
        opt.textContent = `${country.flag} ${country.name.common} (${code})`;
        select.appendChild(opt);
      });
    });
