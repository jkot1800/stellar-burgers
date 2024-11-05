// Переменные и начальная конфигурация
const BASE_URL = 'https://norma.nomoreparties.space/api'; // Базовый url
const BUN_ID = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`; // ID первой булки
const ANOTHER_BUN_ID = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`; // ID второй булки
const FILLING_ID = `[data-cy=${'643d69a5c3f7b9001cfa093e'}]`; // ID ингредиента

// Настройка тестов
beforeEach(() => {
  // Перехватываем запросы и подставляем моковые данные
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  cy.intercept('POST', `${BASE_URL}/auth/login`, {
    fixture: 'user.json'
  }).as('login');

  cy.intercept('GET', `${BASE_URL}/auth/user`, {
    fixture: 'user.json'
  }).as('getUser');

  cy.intercept('POST', `${BASE_URL}/orders`, {
    fixture: 'orderResponse.json'
  }).as('createOrder');

  // Установка токенов авторизации перед каждым тестом
  window.localStorage.setItem('refreshToken', 'refreshToken');
  cy.setCookie('accessToken', 'accessToken');

  cy.visit('/');
  cy.viewport(1440, 800);
  cy.wait('@getIngredients'); // Ожидаем завершения загрузки ингредиентов
  cy.get('#modals').as('modal'); // Назначаем модальное окно на алиас
});

// Тестирование добавление ингредиентов из списка в конструктор разными способами
describe('Добавление ингредиента в конструктор', () => {
  it('Увеличение счетчика ингредиента при добавлении в конструктор', () => {
    cy.get(FILLING_ID).children('button').click();
    cy.get(FILLING_ID).find('.counter__num').contains('1');
  });
  describe('Добавление булок и начинок', () => {
    it('Добавление булки и начинки в конструктор', () => {
      cy.get(BUN_ID).children('button').click();
      cy.get(FILLING_ID).children('button').click();
    });
    it('Добавление булки после добавления начинки в конструктор', () => {
      cy.get(FILLING_ID).children('button').click();
      cy.get(BUN_ID).children('button').click();
    });
  });
  describe('Замена булок', () => {
    it('Замена булки другой булкой без начинки в конструкторе', () => {
      cy.get(BUN_ID).children('button').click();
      cy.get(ANOTHER_BUN_ID).children('button').click();
    });
    it('Замена булки другой булкой с начинкой в конструкторе', () => {
      cy.get(BUN_ID).children('button').click();
      cy.get(FILLING_ID).children('button').click();
      cy.get(ANOTHER_BUN_ID).children('button').click();
    });
  });
});

// Тестирование модальных окон
describe('Тестирование модального окна', () => {
  it('Открытие и проверка отображения модального окна, содержащее данные об ингредиенте', () => {
    cy.get('@modal').should('be.empty'); // Проверяет, что элемент @modal (модальное окно) изначально пустой
    cy.get(FILLING_ID).children('a').click(); // Имитирует клик на ссылку внутри элемента ID_FILLING (например, на ингредиент)
    cy.get('@modal').should('be.not.empty'); // Проверяет, что после клика элемент @modal больше не пуст (модальное окно открылось и в нем есть контент)
    cy.url().should('include', '643d69a5c3f7b9001cfa093e'); // Проверяет, что URL изменился и содержит нужный параметр, подтверждая открытие окна
  });
  it('Закрытие модального окна нажатием на крестик', () => {
    cy.get('@modal').should('be.empty'); // Проверка, что модальное окно пустое
    cy.get(FILLING_ID).children('a').click(); // Открытие модального окна
    cy.get('@modal').should('be.not.empty'); // Проверка, что окно открылось
    cy.get('@modal').find('button').click(); // Имитирует клик на крестик в модальном окне
    cy.get('@modal').should('be.empty'); // Проверка, что модальное окно закрылось
  });
  it('Закрытие модального окна нажатием на клавишу Escape', () => {
    cy.get('@modal').should('be.empty'); // Проверка, что модальное окно пустое
    cy.get(FILLING_ID).children('a').click(); // Открытие модального окна
    cy.get('@modal').should('be.not.empty'); // Проверка, что окно открылось
    cy.get('body').trigger('keydown', { key: 'Escape' }); // Имитирует нажатие клавиши Escape на элементе body
    cy.get('@modal').should('be.empty'); // Проверка, что окно закрылось
  });
  it('Закрытие модального окна с данными ингредиента кликом на оверлей', () => {
    cy.get('@modal').should('be.empty'); // Проверка, что модальное окно пустое
    cy.get(FILLING_ID).children('a').click(); // Открытие модального окна
    cy.get('@modal').should('be.not.empty'); // Проверка, что окно открылось
    cy.get(`[data-cy='overlay']`).click({ force: true }); // Имитирует клик на элемент оверлея (фон за модальным окном), что должно закрыть окно
    cy.get('@modal').should('be.empty'); // Проверка, что окно закрылось
  });
});

// Тест создания заказа
describe('Оформление заказа', () => {
  afterEach(() => {
    // Очищаем состояние после каждого теста внутри текущего набора
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });
  it('Добавление ингредиентов в конструткор и нажатие на кнопку заказа, проверка открытия модального окна успешного заказа и корректного номера заказа, затем, закрытие модального окна', () => {
    cy.get(BUN_ID).children('button').click(); // Добавляем булку
    cy.get(FILLING_ID).children('button').click(); // Добавляем начинку
    cy.get(`[data-cy='order-button']`).click(); // Кликаем на кнопку заказа
    cy.get('@modal').find('h2').contains('58504'); // Проверка номера заказа из mock-данных в orderResponse.json
    cy.get('@modal').find('button').click(); // Закрываем модальное окно
    cy.get('@modal').should('be.empty'); // Проверяем, что модальное окно закрыто
  });
  it('Проверка, что конструктор пуст после оформления заказа', () => {
    cy.get('[data-cy="constructor"]').should('contain.text', 'Выберите булки');
    cy.get('[data-cy="filling-list"]').should(
      'contain.text',
      'Выберите начинку'
    );
  });
});