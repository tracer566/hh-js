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
const foundText = document.querySelector('.found');
const formSearch = document.querySelector('.bottom__search');
const orderBy = document.querySelector('#order_by');
const searchPeriod = document.querySelector('#search_period');

let data = [];

// 2 пример возвращает число и слово  https://codepen.io/Quper/pen/zYGxbJm
const declOfNum = (n, titles) => n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
  0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

/* получаю данные http://localhost:3000/api/vacancy или db.json,деструктуризация {search},создаст переменную */
const getData = ({ searсh, id, country, city } = {}) => {

  return fetch(`db.json`)
    .then(responce => {
      if (responce.ok) {
        return responce.json();
      } else {
        throw `Возможно ошибка в адресе или сервер не работает.Статус ошибки:${responce.status}`;
      }
    }).then((data) => {
      //search 
      if (searсh) {
        const filterData = data.filter((item) => {
          return item.title.toLowerCase().includes(searсh.toLowerCase())
            || item.description.toLowerCase().includes(searсh.toLowerCase())
            || item.employer.toLowerCase().includes(searсh.toLowerCase());
        });

        return filterData;
      };
      //id вакансии для модалки
      if (id) {
        const findCard = data.find(item => {
          // вернуть из базы item.id вакансию равную переданному id
          return item.id === id;
        });
        return findCard
      };
      //страна 
      if (country) {
        const filterData = data.filter((item) => {
          return item.country.toLowerCase().includes(country.toLowerCase())
        });

        return filterData;

      };

      //страна 
      if (city) {
        const filterData = data.filter((item) => {
          return item.address.toLowerCase().includes(city.toLowerCase())
        });
        return filterData;
      };

      // return data.splice(0, 10);
      // console.log(data);
      return data;

    })
    .catch(error => {
      console.error(`Данные не получены-ошибка ${error}`);
    });


}

// открывает модалку вакансий
const openModal = () => {
  vacancyModalOverlay.classList.add('overlay_active')
};

// закрывает модалку вакансий
const closeModal = () => {
  vacancyModalOverlay.classList.remove('overlay_active')
};

/* создание одной карточки */
const createCard = (vacancy) => {
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

/* вывод на страницу всех карточек */
const renderCards = (data, textSearch = '') => {
  // console.log('render data: ', data);
  if (textSearch) {
    // склонение слов функция declOfNum(number,[word1,word2,word3])
    foundText.innerHTML = `Найдено ${declOfNum(data.length, ['вакансия', 'вакансии', 'вакансий'])}  &laquo;<span class="found__item">${textSearch}</span>&raquo;`
  }
  resultList.textContent = '';
  // createCard это функция () => {} вставленная в метод,работает и выглядит так же
  const cards = data.map(createCard);
  resultList.append(...cards)
};

// сортировка данных по дате,возрастанию или убыванию,вызывается в нескольких местах
const sortData = () => {
  // console.log('sortData: ', data);
  switch (orderBy.value) {
    case 'down':
      data.sort((a, b) => a.minCompensation - b.minCompensation);
      break;
    case 'up':
      data.sort((a, b) => b.minCompensation - a.minCompensation);
      break;
    default:
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
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

      // меняю value скрытому полю,беру из data-sort
      orderBy.value = event.target.dataset.sort;
      sortData();
      renderCards(data);

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
  // клик на кнопку страны
  topСityBtn.addEventListener('click', () => {
    modalCity.classList.toggle('city_active')
  });

  // закрывает модалку страны
  closeModalCity.addEventListener('click', () => {
    modalCity.classList.remove('city_active')
  });

  // меняет страну
  cityRegionList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('city__link')) {
      topСityBtn.textContent = event.target.textContent;
      modalCity.classList.remove('city_active');

      // фильтр данных по городам и странам
      if (event.target.href.includes('city')) {
        // возращается promice нужны async,await
        data = await getData({ city: event.target.textContent });
        renderCards(data);
      } else if (event.target.href.includes('country')) {
        // возращается promice нужны async,await
        data = await getData({ country: event.target.textContent });
        sortData();
        renderCards(data);
      };
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
  // делегирование на весь список вакансий,для открытия модалки вакансии
  resultList.addEventListener('click', async (event) => {
    // в дата атрибутах на кнопках есть data-vacancy
    if (event.target.dataset.vacancy) {
      event.preventDefault();
      openModal();
      vacancyModalOverlay.innerHTML = ``;
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
    };
  });
};

//поиск
const handlerSearch = () => {
  formSearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textSearch = formSearch.search.value;
    console.log('textSearch: ', textSearch);

    if (textSearch.length > 2) {
      formSearch.search.style.borderColor = "";
      // получаю данные поиска из базы
      data = await getData({ searсh: textSearch });
      sortData();
      renderCards(data, textSearch);
      // очищаю форму
      formSearch.reset();
    } else {
      formSearch.search.style.borderColor = "red";
      setTimeout(() => {
        formSearch.search.style.borderColor = "";
      }, 2e3)
    }
  });
};

// ассинхроная функция запуска и принятие promice из getdata
const init = async () => {
  data = await getData();
  sortData();
  renderCards(data);

  // обработчики
  handlerOptionsMenu();
  handlerCity();
  handlerModalVacancy();
  handlerSearch();
};

init();

// шутливый функционал overlay_active
const overlayNotwork = document.querySelector('.overlay_notwork');
const modalFig = document.querySelector('.modal-fig');
const modalFigTitle = overlayNotwork.querySelector('.modal-fig__title')
const modalFigImage = overlayNotwork.querySelector('.modal-fig__img')


document.body.addEventListener('click', (event) => {
  if (event.target.classList.contains('notWork-modal')) {
    overlayNotwork.classList.add('overlay_active');
    modalFigImage.classList.add('modal-fig__img_animation');
    modalFigTitle.textContent = `Пока "${event.target.textContent}" не работает`
  };

  setTimeout(() => {
    overlayNotwork.classList.remove('overlay_active');
    modalFigImage.classList.remove('modal-fig__img_animation');
  }, 3500)
});