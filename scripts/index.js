'use strict'
// списки под заголовком
// .option__list_active
// const optionBtns = document.querySelectorAll('.option__btn');
// const optionsList = document.querySelectorAll('.option__list');

/* 1 способ */
// optionBtns.forEach((btn) => {
//   btn.addEventListener('click', () => {
//     optionsList.forEach((list) => {
//       if (btn.classList.contains('option__btn_order')) {
//         if (list.classList.contains('option__list_order')) {
//           list.classList.toggle('option__list_active')
//         }
//       } else if (btn.classList.contains('option__btn_period')) {
//         if (list.classList.contains('option__list_period')) {
//           list.classList.toggle('option__list_active')
//         }
//       };
//     });
//   });

// });

/* 2 способ */
// for (let x = 0; x < optionBtns.length; x++) {
//   optionBtns[x].addEventListener('click', () => {
//     for (let i = 0; i < optionsList.length; i++) {
//       if (optionBtns[x] == optionBtns[i]) {
//         optionsList[i].classList.toggle('option__list_active')
//       }
//     }

//   });

// };

const optionBtnOrder = document.querySelector('.option__btn_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionsListOrder = document.querySelector('.option__list_order');
const optionsListPeriod = document.querySelector('.option__list_period');

// contextmenu клик правой кнопкой
// optionBtnOrder.addEventListener('contextmenu', (event) => {
//   event.preventDefault();//отключит контекстное меню
//   consolevent.log('правый');
// });

// клики на кнопки меню
optionBtnOrder.addEventListener('click', () => {
  optionsListOrder.classList.toggle('option__list_active');
  // закрываю чтобы не налипали на другое меню
  optionsListPeriod.classList.remove('option__list_active');
});

optionBtnPeriod.addEventListener('click', () => {
  optionsListPeriod.classList.toggle('option__list_active');
  // закрываю чтобы не налипали на другое меню
  optionsListOrder.classList.remove('option__list_active');
});

// оживление пунктов меню
optionsListOrder.addEventListener('click', (event) => {
  if (event.target.classList.contains('option__item')) {
    optionsListOrder.querySelectorAll('.option__item').forEach((item) => {
      item.classList.remove('option__item_active')
    });
    event.target.classList.add('option__item_active');
    optionBtnOrder.textContent = event.target.textContent;
    optionsListOrder.classList.remove('option__list_active');
  };

});

// оживление 2-го пункта меню
optionsListPeriod.addEventListener('click', (event) => {
  if (event.target.classList.contains('option__item')) {
    optionsListPeriod.querySelectorAll('.option__item').forEach((item) => {
      item.classList.remove('option__item_active')
    });
    event.target.classList.add('option__item_active');
    optionBtnPeriod.textContent = event.target.textContent;
    optionsListPeriod.classList.remove('option__list_active');
  };

});


// еще что то