let displayValue = "";
let firstNumber = "";
let operator = "";
let secondNumber = "";

let isMainDisplayFull = false;
let isEqualsPressed = false;
let isOperatorPressed = false;

const mainDisplay = document.querySelector(".display.main");
const secondaryDisplay = document.querySelector(".display.secondary");
const buttons = document.querySelectorAll("button");

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(number1, operator, number2) {
  let a = +number1;
  let b = +number2;

  switch (operator) {
    case "+":
      return add(a, b).toString();
      break;
    case "-":
      return subtract(a, b).toString();
      break;
    case "×":
      return multiply(a, b).toString();
      break;
    case "÷":
      if (a === 0 && b === 0) {
        return "0";
      } else if (!isFinite(a) && !isFinite(b)) {
        return "Infinity";
      } else {
        return divide(a, b).toString();
      }
      break;
  }
}

function maxNumber(string) {
  let newString = "";

  newString = string.replace(",", "");
  newString = newString.replace("-", "");

  return newString.length;
}

function formatNumbers(string) {
  const newFormat = new Intl.NumberFormat("pl-PL", {useGrouping: true, maximumFractionDigits: 5})
  let integer = "";
  let decimal = "";

  if (string === "Infinity" || 
      string === "-Infinity" ||
     (string.includes("e") && string.length <= 15)) {
    return string;
  } else if (maxNumber(string) > 15) {
    return Number(string).toExponential(10);
  } else {
    if (string.substr(string.length - 1, 1) === ",") {
      integer = Number(string.slice(0, string.indexOf(",")));
      return newFormat.format(integer) + ",";
    } else if (string.includes(",") === false) {
      integer = Number(string);
      return newFormat.format(integer);
    } else if (string.includes(",") === true) {
      integer = Number(string.slice(0, string.indexOf(",")));
      decimal = string.slice(string.indexOf(","));
      return newFormat.format(integer) + decimal;
    }
  }
}

function updateMainDisplay(input) {
  if (maxNumber(displayValue) < 15) {
    if ((displayValue === "0" && input === 0) || 
       (displayValue === "0" && input !== 0 && input !== ",")) {
      displayValue = "";
      displayValue += input;
      mainDisplay.innerText = "";
      mainDisplay.insertAdjacentText("beforeend", formatNumbers(displayValue));
    } else {
      displayValue += input;
      mainDisplay.innerText = "";
      mainDisplay.insertAdjacentText("beforeend",formatNumbers(displayValue));
    }
  }
}

function clear() {
  displayValue = ""
  firstNumber = "";
  operator = "";
  secondNumber = ""
  mainDisplay.innerText = "";
  secondaryDisplay.innerText = "";
  isMainDisplayFull = false;
  isEqualsPressed = false;
  isOperatorPressed = false;
}

function backspace() {
  if (displayValue.length > 0 && isEqualsPressed === false) {
    displayValue = displayValue.slice(0, displayValue.length - 1);
    mainDisplay.innerText = "";
    mainDisplay.insertAdjacentText("beforeend", formatNumbers(displayValue));
  }
}

function addOperator(symbol) {
  if (operator.length === 0 && displayValue.length > 0 && isOperatorPressed === false) {
    if (displayValue.substr(displayValue.length - 1, 1) === ",") {
      firstNumber = displayValue.slice(0, displayValue.indexOf(","));
      mainDisplay.innerText = "";
      mainDisplay.insertAdjacentText("beforeend", formatNumbers(displayValue.slice(0, displayValue.indexOf(","))));
    } else {
      firstNumber = displayValue.replace(",", ".");
    }
    operator = symbol;
    isMainDisplayFull = true;
    secondaryDisplay.innerText = `${firstNumber} ${operator}`;
    isOperatorPressed = true;
    displayValue = "";
  } else if (firstNumber.length > 0) {
    operator = symbol;
    secondaryDisplay.innerText = `${firstNumber} ${operator}`;
  }
}

function clearMainDisplay() {
  if (isMainDisplayFull === true) {
    displayValue = "";
    isMainDisplayFull = false;
  }
}

function clearSecondaryDisplay(symbol) {
  if (isEqualsPressed === true &&
     (symbol === "+" || 
     symbol === "-" ||
     symbol === "×" ||
     symbol === "÷")) {
    isEqualsPressed = false;
    operator = "";
    secondNumber = "";
  } else if (isEqualsPressed === true) {
    secondaryDisplay.innerText = "";
    isEqualsPressed = false;
    displayValue = "";
    firstNumber = "";
    operator = "";
    secondNumber = "";
  }
}

function calculateUsingEquals() {
  let tempNum = "";
  let result = "";
  let noBreakingSpace = String.fromCharCode(160);
  
  if (isEqualsPressed === false && displayValue.length > 0) {
    if (displayValue.substr(displayValue.length - 1, 1) === ",") {
      secondNumber = displayValue.slice(0, displayValue.indexOf(","));
    } else {
      secondNumber = displayValue.replace(",", ".");
    }
    secondaryDisplay.innerText = `${firstNumber} ${operator} ${secondNumber} =`;
    result = operate(firstNumber, operator, secondNumber);
    displayValue = formatNumbers(result).replaceAll(noBreakingSpace, "");
    mainDisplay.innerText = formatNumbers(result);
    isEqualsPressed = true;
    isMainDisplayFull = true;
    isOperatorPressed = false;
  } else if (isEqualsPressed === false && displayValue.length === 0) {
    secondNumber = firstNumber;
    secondaryDisplay.innerText = `${firstNumber} ${operator} ${secondNumber} =`;
    result = operate(firstNumber, operator, secondNumber);
    displayValue = formatNumbers(result).replaceAll(noBreakingSpace, "");
    mainDisplay.innerText = formatNumbers(result);
    isEqualsPressed = true;
    isMainDisplayFull = true;
    isOperatorPressed = false;
  } else {
    tempNum = secondNumber;
    firstNumber = displayValue.replaceAll(noBreakingSpace, "");
    firstNumber = firstNumber.replace(",", ".");
    secondaryDisplay.innerText = `${firstNumber} ${operator} ${tempNum} =`;
    result = operate(firstNumber, operator, secondNumber);
    displayValue = formatNumbers(result).replaceAll(noBreakingSpace, "");
    mainDisplay.innerText = formatNumbers(result);
  }
}

function calculateUsingOperators(symbol) {
  let result = "";
  let noBreakingSpace = String.fromCharCode(160);
  
  if (isOperatorPressed === true && displayValue.length > 0) {
    if (displayValue.substr(displayValue.length - 1, 1) === ",") {
      secondNumber = displayValue.slice(0, displayValue.indexOf(","));
    } else {
      secondNumber = displayValue.replace(",", ".");
    }
    result = operate(firstNumber, operator, secondNumber);
    displayValue = formatNumbers(result).replaceAll(noBreakingSpace, "");
    mainDisplay.innerText = formatNumbers(result);
    operator = "";
    isMainDisplayFull = true;
    isOperatorPressed = false;
  }
}

function negativeNumbers() {
  if (displayValue.length > 0 && displayValue !== "0" && displayValue.slice(0, 1) !== "-") {
    displayValue = "-" + displayValue;
    mainDisplay.innerText = formatNumbers(displayValue);
  } else if (displayValue.length > 0 && displayValue !== "0" && displayValue.slice(0, 1) === "-") {
    displayValue = displayValue.slice(1);
    mainDisplay.innerText = formatNumbers(displayValue);
  } else if (displayValue.length === 0 && firstNumber.length > 0) {
    displayValue = "-" + firstNumber;
    mainDisplay.innerText = formatNumbers(displayValue);
  }
}

buttons.forEach(button => {
  button.addEventListener("click", (event) => {
    let target = event.target;

    switch (target.getAttribute("class")) {
      case "num0":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(0);
        break;

      case "num1":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(1);
        break;

      case "num2":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(2);
        break;

      case "num3":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(3);
        break;

      case "num4":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(4);
        break;

      case "num5":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(5);
        break;

      case "num6":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(6);
        break;

      case "num7":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(7);
        break;

      case "num8":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(8);
        break;

      case "num9":
        clearSecondaryDisplay();
        clearMainDisplay();
        updateMainDisplay(9);
        break;

      case "plus":
        clearSecondaryDisplay("+");
        calculateUsingOperators("+");
        addOperator("+");
        break;

      case "minus":
        clearSecondaryDisplay("-");
        calculateUsingOperators("-");
        addOperator("-");
        break;

      case "multiply":
        clearSecondaryDisplay("×");
        calculateUsingOperators("×");
        addOperator("×");
        break;

      case "divide":
        clearSecondaryDisplay("÷");
        calculateUsingOperators("÷");
        addOperator("÷");
        break;

      case "equals":
        if (operator.length > 0) calculateUsingEquals();
        break;

      case "clear":
        clear();
        break;

      case "backspace":
        backspace();
        if (displayValue.length === 0 && isEqualsPressed === false) {
          displayValue = "0";
          mainDisplay.innerText = "";
          mainDisplay.insertAdjacentText("beforeend", formatNumbers(displayValue));
        }
        break;

      case "decimal":
        if (displayValue.length > 0 && 
            !displayValue.includes(",") && 
            isEqualsPressed === false) updateMainDisplay(",");
        break;

      case "negativeNumber":
        negativeNumbers();
        break;
    }
  });
});

document.addEventListener("keydown", (event) => {
  let targetKey = event.key;
  
  switch (targetKey) {
    case "0":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(0);
      break;
      
    case "1":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(1);
      break;
      
    case "2":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(2);
      break;
      
    case "3":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(3);
      break;
    case "4":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(4);
      break;
      
    case "5":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(5);
      break;
      
    case "6":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(6);
      break;
      
    case "7":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(7);
      break;
    case "8":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(8);
      break;
      
    case "9":
      clearSecondaryDisplay();
      clearMainDisplay();
      updateMainDisplay(9);
      break;
      
    case "+":
      clearSecondaryDisplay("+");
      calculateUsingOperators("+");
      addOperator("+");
      break;
      
    case "-":
      clearSecondaryDisplay("-");
      calculateUsingOperators("-");
      addOperator("-");
      break;
      
    case "*":
      clearSecondaryDisplay("×");
      calculateUsingOperators("×");
      addOperator("×");
      break;
      
    case "/":
      event.preventDefault();
      clearSecondaryDisplay("÷");
      calculateUsingOperators("÷");
      addOperator("÷");
      break;
      
    case "Enter":
      event.preventDefault();
      if (operator.length > 0) calculateUsingEquals();
      break;
      
    case "Delete":
      clear();
      break;
      
    case "Backspace":
      backspace();
      if (displayValue.length === 0 && isEqualsPressed === false) {
        displayValue = "0";
        mainDisplay.innerText = "";
        mainDisplay.insertAdjacentText("beforeend", formatNumbers(displayValue));
      }
      break;
      
    case ",":
      if (displayValue.length > 0 && 
          !displayValue.includes(",") && 
          isEqualsPressed === false) updateMainDisplay(",");
      break;

    case ".":
      if (displayValue.length > 0 && 
          !displayValue.includes(",") && 
          isEqualsPressed === false) updateMainDisplay(",");
      break;
  }
});