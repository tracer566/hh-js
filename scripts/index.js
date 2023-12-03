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
  const target = event.target;

  if (target.classList.contains('option__item')) {
    for (const elem of optionsListPeriod.querySelectorAll('.option__item')) {
      if (elem === target) {
        elem.classList.add('option__item_active');
      } else {
        elem.classList.remove('option__item_active');
      }
    }
    optionBtnPeriod.textContent = event.target.textContent;
    optionsListPeriod.classList.remove('option__list_active');
  }

  // if (event.target.classList.contains('option__item')) {
  //   optionsListPeriod.querySelectorAll('.option__item').forEach((item) => {
  //     item.classList.remove('option__item_active')
  //   });
  //   event.target.classList.add('option__item_active');
  //   optionBtnPeriod.textContent = event.target.textContent;
  //   optionsListPeriod.classList.remove('option__list_active');
  // };

});


// модалка выбор города
const topСityBtn = document.querySelector('.top__city');
const modalCity = document.querySelector('.city');
const closeModalCity = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');

topСityBtn.addEventListener('click', () => {
  modalCity.classList.toggle('city_active')
});


closeModalCity.addEventListener('click', () => {
  modalCity.classList.remove('city_active')
});

cityRegionList.addEventListener('click', (event) => {
  if (event.target.classList.contains('city__link')) {
    topСityBtn.textContent = event.target.textContent;
    modalCity.classList.remove('city_active')
  }
});

// модалка вакансии
const vacancyModalOverlay = document.querySelector('.overlay_vacancy');
// const vacancyModalClose = document.querySelector('.modal__close');
const resultList = document.querySelector('.result__list');
// const vacancyTitle = document.querySelector('.vacancy__title');
// const vacancyOpenModal = document.querySelector('.vacancy__open-modal');

const openModal = () => {
  vacancyModalOverlay.classList.add('overlay_active')
};

const closeModal = () => {
  vacancyModalOverlay.classList.remove('overlay_active')
};


// делегирование на весь список
resultList.addEventListener('click', (event) => {
  event.preventDefault();
  // в дата атрибутах на кнопках есть data-vacancy
  if (event.target.dataset.vacancy) {
    openModal();
  }
});

// vacancyModalClose.addEventListener('click', closeModal);
vacancyModalOverlay.addEventListener('click', e => {
  const target = e.target;
  if (target === vacancyModalOverlay || target.classList.contains('modal__close')) {
    closeModal();
  };

});

// вывод карточек
// resultList 
/* создание одной карточки */
const createCard = (vacancy) => {
  // console.log('vacancy: ', vacancy);

  const {
    id,
    title,
    compensation,
    workSchedule,
    employer,
    country,
    address,
    experience,
    description,
    date,
    employment
  } = vacancy;

  const card = document.createElement('li');
  card.classList.add('result__item');

  card.insertAdjacentHTML('afterbegin', `
  <article class="vacancy">
<h2 class="vacancy__title">
<a class="vacancy__open-modal" href="#" data-vacancy="${id}">${title}</a>
</h2>
<p class="vacancy__compensation">${compensation}</p>
<p class="vacancy__work-schedule">${workSchedule}</p>
<div class="vacancy__employer">
<p class="vacancy__employer-title">${employer}</p>
<p class="vacancy__employer-address">${address}</p>
</div>
<p class="vacancy__description">${description}</p>
<p class="vacancy__date">
<time datetime="2023-12-01">${date}</time>
</p>
<div class="vacancy__wrapper-btn">
<a class="vacancy__response vacancy__open-modal" href="#" data-vacancy="${id}">Откликнуться</a>
<button class="vacancy__contacts">Показать контакты</button>
</div>
</article>
  `);

  return card;

};

// 1 способ-вывод на страницу всех карточек
// const renderCards = (data) => {
//   resultList.textContent = '';
//   // const cards = [];
//   for (let i = 0; i < data.length; i += 1) {
//     // cards.push(createCard(data[i]));
//     resultList.append(createCard(data[i]))
//   };
//   // resultList.prepend(...cards);
// };

/* 2 способ-вывод на страницу всех карточек */
const renderCards = (data) => {
  resultList.textContent = '';
  const cards = data.map(createCard);
  resultList.append(...cards)
};

/* получаю данные http://localhost:3000/api/vacancy или db.json*/
const getData = () => fetch('db.json')
  .then(responce => {
    console.log('responce: ', responce);
    if (responce.ok) {
      return responce.json();
    } else {
      throw `Возможно ошибка в адресе или сервер не работает.Статус ошибки:${responce.status}`;
    }
  })
  .catch(error => {
    console.error(`Данные не получены-ошибка ${error}`);
  })

// ассинхроная функция для принятие promice из getdata
const init = async () => {
  const data = await getData();
  // console.log('data: ', data);
  renderCards(data);
};

init();

// renderCards(['I', 'WAS', 'THE', 'FIRST', 'HUNTER', 'ON', 'MONSTERS', 'FROM', 'LONDON']);
