// Меню на телефоне
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', false);
    }
});

// Тест уровня: вопросы от A1 к B2, уровень = число верных ответов
const QUESTIONS = [
    ['I ___ from Moscow.', ['am', 'is', 'are'], 0],
    ['She ___ to work by metro every day.', ['go', 'goes', 'going'], 1],
    ['I ___ this film last weekend.', ['have seen', 'see', 'saw'], 2],
    ['If I ___ more free time, I would travel more.', ['had', 'have', 'will have'], 0],
    ['By next June, she ___ here for ten years.', ['works', 'will have worked', 'is working'], 1],
];
const LEVELS = [
    ['A1', 'Начинающий', 'Начните с группы для нулевого уровня: объясняем на русском и быстро переходим к простым диалогам.'],
    ['A1', 'Начинающий', 'Базу вы знаете. Мини-группа A1 закрепит её и научит говорить простыми фразами.'],
    ['A2', 'Базовый', 'Вы понимаете простые фразы. В группе A2 научитесь говорить о работе, планах и путешествиях.'],
    ['B1', 'Средний', 'Вы можете объясниться в поездке. Группа B1 и разговорный клуб уберут страх говорить.'],
    ['B1+', 'Уверенный средний', 'Хорошая база. Подойдёт группа B1+ или индивидуальные уроки под вашу цель.'],
    ['B2', 'Выше среднего', 'Отличный уровень. Разговорный клуб и подготовка к IELTS или собеседованиям помогут выйти на C1.'],
];
const quiz = document.getElementById('quiz');
const quizTemplate = quiz.innerHTML;
let step = 0;
let score = 0;

function renderQuestion() {
    const [q, options] = QUESTIONS[step];
    document.getElementById('qStep').textContent = `Вопрос ${step + 1} из ${QUESTIONS.length}`;
    document.getElementById('qBar').style.width = `${(step / QUESTIONS.length) * 100}%`;
    document.getElementById('qText').innerHTML = q.replace('___', '<u>&nbsp;</u>');
    document.getElementById('qOptions').innerHTML = options
        .map((o, i) => `<button class="opt" type="button" data-i="${i}">${o}</button>`).join('');
}

function renderResult() {
    const [level, name, advice] = LEVELS[score];
    quiz.innerHTML = `
        <div class="quiz__top"><span>Готово: ${score} из ${QUESTIONS.length}</span><div class="quiz__bar"><i style="width:100%"></i></div></div>
        <div class="quiz__result">
            <p class="quiz__level">${level}</p>
            <p><b>${name}</b></p>
            <p>${advice}</p>
        </div>
        <div class="quiz__actions">
            <a class="btn" href="#form" id="quizCta">Пробный урок бесплатно</a>
            <button class="btn btn--light" type="button" id="quizAgain">Пройти ещё раз</button>
        </div>`;
    // Подставляем уровень в форму заявки
    const select = document.querySelector('#leadForm [name=level]');
    const option = [...select.options].find((o) => o.text.startsWith(level.slice(0, 2)));
    if (option) select.value = option.value;
    document.getElementById('quizAgain').addEventListener('click', () => {
        quiz.innerHTML = quizTemplate;
        step = score = 0;
        renderQuestion();
    });
}

quiz.addEventListener('click', (e) => {
    const btn = e.target.closest('.opt');
    if (!btn) return;
    if (+btn.dataset.i === QUESTIONS[step][2]) score++;
    step++;
    step < QUESTIONS.length ? renderQuestion() : renderResult();
});
renderQuestion();

// Форма: проверка полей, без отправки (демо)
const form = document.getElementById('leadForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = document.getElementById('formError');
    const bad = [];
    const name = form.elements.name;
    const phone = form.elements.phone;
    name.setAttribute('aria-invalid', !name.value.trim());
    if (!name.value.trim()) bad.push('имя');
    const digits = phone.value.replace(/\D/g, '');
    const phoneOk = digits.length === 11 || digits.length === 10;
    phone.setAttribute('aria-invalid', !phoneOk);
    if (!phoneOk) bad.push('телефон');
    if (!form.elements.agree.checked) bad.push('согласие на обработку данных');
    err.hidden = !bad.length;
    err.textContent = bad.length ? `Проверьте: ${bad.join(', ')}` : '';
    if (bad.length) return;
    form.querySelector('button').hidden = true;
    document.getElementById('formOk').hidden = false;
});
