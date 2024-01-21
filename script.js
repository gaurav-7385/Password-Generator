const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#Symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatepassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-=+{[}]:;"<,>.?/';

let password = ""; //at starting password is null
let passwordlength = 10; //by default password length is 10
let checkCount = 1; //by default one checkbox is marked as ticked
handleSlider();
//set strength circle to grey

//set password length
function handleSlider() {
  inputSlider.value = passwordlength;
  lengthDisplay.innerHTML = passwordlength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
  return getRndInteger(0, 9);
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 90));
}
function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordlength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerHTML = "copied";
  } catch (e) {
    copyMsg.innerHTML = "failed";
  }
  //to make copy span visible

  copyMsg.classList.add("active");
  console.log("active class added");

  //copied msg will get invisible after 2 sec...
  setTimeout(() => {
    copyMsg.classList.add("hide");
    console.log("active class removed");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handleSlider();
});
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

//generate password btn

generateBtn.addEventListener("click", () => {
  //none of the checkbox selected
  if (checkCount <= 0) return;
  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }
  //here to find new passsword
  console.log("starting the journey");
  //remove old password
  password = "";

  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  //compulsory addtion
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("compulsory addition done");

  //remaining addtion
  for (let i = 0; i < passwordlength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  console.log("remaining addition done");
  //suffle the password
  function shufflePassword(array) {
    // Fisher-Yates method
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
  }

  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;

  //calculate strength
  calcStrength();
});
