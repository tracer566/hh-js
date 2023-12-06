'use strict'
const optionBtnOrder = document.querySelector('.option__btn_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionsListOrder = document.querySelector('.option__list_order');
const optionsListPeriod = document.querySelector('.option__list_period');
const topСityBtn = document.querySelector('.top__city');
const modalCity = document.querySelector('.city');
const closeModalCity = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');
const vacancyModalOverlay = document.querySelector('.overlay_vacancy');
const resultList = document.querySelector('.result__list');
const formSearch = document.querySelector('.bottom__search');
const foundText = document.querySelector('.found');

const declOfNum = (n, titles) => n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
  0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

/* получаю данные http://localhost:3000/api/vacancy или db.json*/
// деструктуризация {search},создаст переменную
const getData = ({ searсh, id } = {}) => {
  // поиск
  if (searсh) {
    return fetch(`http://localhost:3000/api/vacancy?search=${searсh}`)
      .then(responce => {
        if (responce.ok) {
          return responce.json();
        } else {
          throw `Возможно ошибка в адресе или сервер не работает.Статус ошибки:${responce.status}`;
        }
      })
      .catch(error => {
        console.error(`Данные не получены-ошибка ${error}`);
      })
  };
  // без поиска
  return fetch(`http://localhost:3000/api/vacancy/${id ? id : ''}`)
    .then(responce => {
      if (responce.ok) {
        return responce.json();
      } else {
        throw `Возможно ошибка в адресе или сервер не работает.Статус ошибки:${responce.status}`;
      }
    })
    .catch(error => {
      console.error(`Данные не получены-ошибка ${error}`);
    })
}

// модалка вакансий
const openModal = () => {
  vacancyModalOverlay.classList.add('overlay_active')
};

const closeModal = () => {
  vacancyModalOverlay.classList.remove('overlay_active')
};

// вывод карточек
/* создание одной карточки */
const createCard = (vacancy) => {
  // console.log('vacancy: ', vacancy);
  const {
    id,
    title,
    compensation,
    workSchedule,
    employer,
    address,
    description,
    date,
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
<time datetime="${date}">${date}</time>
</p>
<div class="vacancy__wrapper-btn">
<a class="vacancy__response vacancy__open-modal" href="#" data-vacancy="${id}">Откликнуться</a>
<button class="vacancy__contacts">Показать контакты</button>
</div>
</article>
  `);
  return card;
};

const renderCards = (data, textSearch = '') => {
  if (textSearch) {
    // склонение слов функция declOfNum(number,[word1,word2,word3])
    foundText.innerHTML = `Найдено ${declOfNum(data.length, ['вакансия', 'вакансии', 'вакансий'])}  &laquo;<span class="found__item">${textSearch}</span>&raquo;`
  }
  resultList.textContent = '';
  // createCard это функция () => {} вставленная в метод,работает и выглядит так же
  const cards = data.map(createCard);
  resultList.append(...cards)
};

// 2 выпадающих меню под заголовком кол-во вакансии
const handlerOptionsMenu = () => {
  // клики на кнопки меню
  optionBtnOrder.addEventListener('click', () => {
    optionsListOrder.classList.toggle('option__list_active');
    optionsListPeriod.classList.remove('option__list_active');
  });

  // клики на кнопки меню
  optionBtnPeriod.addEventListener('click', () => {
    optionsListPeriod.classList.toggle('option__list_active');
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
  });
};

// модалка стран
const handlerCity = () => {
  // открыть модалку стран
  topСityBtn.addEventListener('click', () => {
    modalCity.classList.toggle('city_active')
  });

  // закрыть модалку стран
  closeModalCity.addEventListener('click', () => {
    modalCity.classList.remove('city_active')
  });

  // навешиваю делегирование на города и страны модалки
  cityRegionList.addEventListener('click', (event) => {
    if (event.target.classList.contains('city__link')) {
      topСityBtn.textContent = event.target.textContent;
      modalCity.classList.remove('city_active')
    }
  });
};

// создает модалку для каждой вакансии
const createModalVacancy = (vacancy) => {
  const { title, compensation, workSchedule, employer, address, experience, description, skills } = vacancy;

  // перебираю массив скиллов и создаю ul с li
  const addSkills = () => {
    const list = skills.map((skill) => {
      const li = document.createElement('li');
      li.classList.add('skills__item');
      li.textContent = skill;
      return li;
    })
    const ul = document.createElement('ul');
    ul.classList.add('skills__list');
    ul.append(...list);
    return ul;
  };

  const resultSkills = addSkills();

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
  <button class="modal__close">✕</button>
<h2 class="modal__title">${title}</h2>
<p class="modal__compensation">${compensation}</p>
<p class="modal__employer">${employer}</p>
<p class="modal__address">${address}</p>
<p class="modal__experience">${experience}</p>
<p class="modal__employment">${workSchedule}</p>
<p class="modal__description">${description}</p>
<div class="modal__skills skills">
<h2 class="skills__title">Требования к кандидату:</h2>
<ul class="skills__list">
${resultSkills.outerHTML}
</ul>
</div>
<button class="modal__response">Отправить резюме</button>
  `
  return modal;
};

// открывает и вставляет модалку вакансий
const handlerModalVacancy = () => {
  // let modal = null; //1
  // делегирование на весь список вакансий,для открытия модалки вакансии
  resultList.addEventListener('click', async (event) => {
    // в дата атрибутах на кнопках есть data-vacancy
    if (event.target.dataset.vacancy) {
      event.preventDefault();
      openModal();
      vacancyModalOverlay.innerHTML = ``; //чищу лишние модалки
      /* в getData деструктуризация({ searсh, id } и можно выбрать какому параметру назначить
      event.target.dataset.vacancy и делаю функцию асинхронной при вызове getData */
      const data = await getData({ id: event.target.dataset.vacancy });
      const modal = createModalVacancy(data);
      vacancyModalOverlay.append(modal);
    }
  });

  // закрыть модалку вакансии
  vacancyModalOverlay.addEventListener('click', e => {
    const target = e.target;
    if (target === vacancyModalOverlay || target.classList.contains('modal__close')) {
      closeModal();
      // modal.remove();//1
    };
  });
};

const handlerSearch = () => {
  //поиск
  formSearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textSearch = formSearch.search.value;
    console.log('textSearch: ', textSearch);

    if (textSearch.length > 2) {
      formSearch.search.style.borderColor = "";
      // получаю данные поиска из базы
      const data = await getData({ searсh: textSearch });
      renderCards(data, textSearch);
      // очищаю форму
      formSearch.reset();
    } else {
      formSearch.search.style.borderColor = "red";
      setTimeout(() => {
        formSearch.search.style.borderColor = "";
      }, 2e3)
    };
  });
};

// запуск 1-ая функция
const init = async () => {
  const data = await getData();
  renderCards(data);

  // обработчики
  handlerOptionsMenu();
  handlerCity();
  handlerModalVacancy();
  handlerSearch();
};

init();

