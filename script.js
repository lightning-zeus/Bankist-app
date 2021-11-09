'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const formatDate = function (date, locale) {
  const calcDaysPassed = function (date1, date2) {
    //console.log(date1, date2);

    let days = Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed == 0) return 'Today';
  if (daysPassed == 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  //console.log(acc.movements);
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (movement, idx, movements) {
    const date = new Date(acc.movementsDates[idx]);

    const formattedMovm = formatCurrency(movement, acc.locale, acc.currency);

    let displayDate = formatDate(date, acc.locale);
    const type = movement > 0 ? `deposit` : `withdrawal`;
    let html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">
              ${idx + 1} ${type}
            </div>
              <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMovm}💶</div>
          </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  let expense = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  expense = Math.abs(expense);
  labelSumOut.textContent = formatCurrency(expense, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (acc.interestRate / 100))
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

// console.log(accounts);
const deposits = movements.filter(movement => movement > 0);
// console.log(deposits);
const withdrawls = movements.filter(movement => movement < 0);
// console.log(withdrawls);
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};
const updateUI = function (acc) {
  //TODO display movements

  displayMovements(acc);

  //TODO Display balance

  calcPrintBalance(acc);

  //TODO display summary

  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {


  const tick = function () {
      const minutes = String(Math.trunc(time / 60)).padStart(2,0);
      const seconds = String(time % 60).padStart(2,0);

    labelTimer.textContent = `${minutes}:${seconds}`;
    

    if (time == 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  }


  //TODO Set time to 5 minutes or 300 seconds
  let time = 120;


  //Call time each second and print the remaining time on the screen
  tick();
  const timer = setInterval(tick, 1000);
  return timer;


  //When the time left is 0, stop the timer and logout user

}
// Event Handlers ////////////

// //Fake Always logged in
let currentAccount, timer;
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

createUsernames(accounts);
//console.log(accounts);

//Experimenting with the API

// const now = new Date();
// const day = `${now.getDate()}`.padStart(2,0);
// const month = `${now.getMonth()}`.padStart(2,0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const minutes = now.getMinutes();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // TODO display GUI and messages
    //console.log('LOGIN');
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //TODO create current date and time at the time of login
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2,0);
    // const minutes = `${now.getMinutes()}`.padStart(2,0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear the login input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    
    timer = startLogoutTimer();
    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAccUsername = inputTransferTo.value;

  const recieverAccount = accounts.find(
    acc => acc.userName === recieverAccUsername
  );
  //recieverAccount?.movements.push(amount);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount?.userName !== currentAccount.userName
  ) {
    //console.log('Transfer Valid');
    //Update the accounts with the transfers

    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    //Update the date aswell with the current transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
    inputTransferAmount.blur();

    //reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount &&
    currentAccount.movements.some(mov => mov >= 0.1 * loanAmount)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmount);
      //clear the input field

      //Add date of loan approval
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';

  //reset Timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closeAccUser = inputCloseUsername.value;
  const closeAccPin = +inputClosePin.value;
  // console.log(closeAccUser, closeAccPin);
  if (
    closeAccUser === currentAccount.userName &&
    closeAccPin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    //Delete the UI
    //console.log(index);
    accounts.splice(index, 1);

    //Hide the UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
