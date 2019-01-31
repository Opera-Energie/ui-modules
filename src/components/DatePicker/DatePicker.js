import './css/style.css';

class DatePicker {

    constructor({
        inputElement,
        useDefaultCss = true,
        wrapperClass= ''}) {
        this.inputDateElement = inputElement;

        this.inputDateElement.setAttribute('type', 'text');
        this.inputDateElement.setAttribute('pattern', '/^(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/');

        this.listMonth = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        this.listDay = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

        this.parentNode = this.inputDateElement.parentNode;

        this.buildStructure();

        this.todayButton = this.parentNode.querySelector('.today');

        this.wrapperCalendar = document.querySelector('.datePickerContainer');

        this.calendar = this.wrapperCalendar.querySelector('.calendar');

        if (!useDefaultCss) {
            this.wrapperCalendar.classList.remove('defaultStyle');
        }

        if (wrapperClass) {
            this.wrapperCalendar.classList.add(wrapperClass);
        }

        this.yearListEl = this.wrapperCalendar.querySelector('.yearList');

        this.yearNav = this.wrapperCalendar.querySelectorAll('.yearListWrapper a');

        this.currentDate = new Date();
        this.currentDay = this.currentDate.getDate();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();

        this.selectedDate = this.currentDate;
        this.selectedYear = parseInt(this.currentYear);
        this.selectedMonth = parseInt(this.currentMonth);
        this.selectedDay = parseInt(this.currentDay);

        this.todayButton.addEventListener('click', () => {
            this.selectedDate = this.currentDate;
            this.selectedYear = parseInt(this.currentYear);
            this.selectedMonth = parseInt(this.currentMonth);
            this.selectedDay = parseInt(this.currentDay);

            this.setNewSelectedDate();
            this.constructMonthList();
            this.constructYearList();
            this.constructDayList();
        });

        this.build();
    }

    build() {
        this.constructMonthList();
        this.constructYearList();
        this.constructDayList();

        this.setNewSelectedDate();

        this.navigateAction();

        this.inputDateElement.addEventListener('focus', () => {
            this.calendar.style.display = 'flex';
            let self = this;

            document.addEventListener('keyup', function actionOnKeyPressed(e) {
                switch (e.which) {
                    // touche tab, entrer, echape
                    case 9:
                    case 13:
                    case 27:
                        self.calendar.style.display = 'none';
                        break;
                }
                e.stopPropagation();
                document.removeEventListener('keyup', actionOnKeyPressed);
            });

            document.addEventListener('click', function clickOutChecking(e) {
                e.stopPropagation();
                let target = e.target;

                if (!self.wrapperCalendar.contains(target)) {
                    self.calendar.style.display = 'none';
                    document.removeEventListener('click', clickOutChecking);
                }

            });
        });

        this.inputDateElement.addEventListener('change', () => {
            this.updateDate();
            this.calendar.style.display = 'none';
        });
    }

    buildStructure() {
        let wrapper = `
              <div class="calendar">
                  <div class="year">
                      <div class="yearListWrapper">
                          <a data-value="less" class="less"></a>
                          <ul class="yearList"></ul>
                          <a data-value="more" class="more"></a>
                      </div>
                  </div>
                  <div class="month">
                      <div class="monthListWrapper">
                          <ul class="monthList"></ul>
                      </div>
                  </div>
                  <div class="day">
                    <div class="resumeDate">
                        <span class="resumeYear"></span>
                        <div class="fullDate">
                            <span class="resumeDayLetter"></span>
                            <span class="resumeDay"></span>
                            <span class="resumeMonth"></span>
                        </div>
                        <a class="today">
                        Aujourd'hui
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon"><path fill="currentColor" d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"/></svg>
                        </a>
                    </div>
                      <div class="dayListWrapper">
                          <table class="dayList">
                              <thead>
                                  <tr>
                                      <th>L</th><th>M</th><th>M</th><th>J</th><th>V</th><th>S</th><th>D</th>
                                  </tr>
                              </thead>
                              <tbody></tbody>
                          </table>
                      </div>
                  </div>
              </div>
            `;

        let container = document.createElement('div');
        container.classList.add('datePickerContainer', 'defaultStyle');
        container.innerHTML = wrapper;
        this.parentNode.insertBefore(container, this.inputDateElement);
        container.prepend(this.inputDateElement);
    }

    constructMonthList() {
        const monthListEl = this.wrapperCalendar.querySelector('.monthList');

        monthListEl.innerHTML = '';

        this.listMonth.forEach((month, key) => {
            let monthEl = document.createElement('li');
            monthEl.setAttribute('data-value', key);
            monthEl.innerHTML = month;

            if (key === this.selectedMonth) {
                monthEl.classList.add('selected');
            }

            monthListEl.appendChild(monthEl);
        });

        monthListEl.querySelectorAll('li').forEach(el => {
            el.addEventListener('click', e => {
                let selectedMonthEl = e.currentTarget;
                this.selectedMonth = parseInt(selectedMonthEl.dataset.value);

                // on regarde si un mois est selectionné
                let oldSelectedMonthEl = monthListEl.querySelector('.selected');
                if (oldSelectedMonthEl) {
                    oldSelectedMonthEl.classList.remove('selected');
                }
                selectedMonthEl.classList.add('selected');

                this.setNewSelectedDate();
                this.constructDayList();
            });
        });
    }

    constructYearList() {
        this.yearListEl.innerHTML = '';

        for (let i = this.selectedYear - 4; i < this.selectedYear + 6; i++) {
            let yearEl = document.createElement('li');
            yearEl.innerHTML = i;
            yearEl.dataset.value = i;

            if (i === this.selectedYear) {
                yearEl.classList.add('selected');
            }

            this.yearListEl.appendChild(yearEl);
        }

        this.yearListEl.querySelectorAll('li').forEach(el => {
            el.addEventListener('click', e => {
                let selectedYearEl = e.currentTarget;
                this.selectedYear = parseInt(selectedYearEl.dataset.value);

                // on regarde si une année est selectionnée
                let oldSelectedYearEl = this.yearListEl.querySelector('.selected');
                if (oldSelectedYearEl) {
                    oldSelectedYearEl.classList.remove('selected');
                }
                selectedYearEl.classList.add('selected');

                this.constructYearList();
                this.setNewSelectedDate();
                this.constructDayList();

                e.stopPropagation();
            });
        });
    }

    constructDayList() {
        const dayListEl = this.wrapperCalendar.querySelector('.dayList');

        dayListEl.querySelector('tbody').innerHTML = '';

        let chosenDate = new Date(this.selectedYear,this.selectedMonth,1);
        // traitement particulier pour le dimanche
        let firstDay = (chosenDate.getDay()-1) < 0 ? 6 : chosenDate.getDay()-1;
        let nbOfDay = this.getNbDaysInMonth(this.selectedYear,this.selectedMonth);

        if (this.selectedDay > nbOfDay) {
            this.selectedDay = nbOfDay;
        }

        let row = document.createElement('tr');
        let nth = 1;
        for (let i = 0; i < nbOfDay + firstDay; i++) {
            if (i%7 == 0) {
                row = document.createElement('tr');
                dayListEl.querySelector('tbody').appendChild(row);
                nth = 1;
            }

            let cell = document.createElement('td');
            let cellValue = (i >= firstDay) ? i - (firstDay-1) : '';

            cell.innerHTML = cellValue;

            if (cellValue !== '') {
                cell.classList.add('days');
                cell.dataset.nth = nth;
            }

            if (i === this.selectedDay-1+firstDay) {
                cell.classList.add('selected');

                let oldDay = dayListEl.querySelector('th.selected');
                if (oldDay) {
                    oldDay.classList.remove('selected');
                }

                let selectedDay = dayListEl.querySelector('th:nth-child('+ nth +')');
                selectedDay.classList.add('selected');
            }
            row.appendChild(cell);

            nth++;
        }

        dayListEl.querySelectorAll('tbody td.days').forEach(el => {
            el.addEventListener('click', e => {
                let selectedDay = e.currentTarget;
                this.selectedDay = parseInt(selectedDay.innerHTML);

                // on regarde si un jour est selectionné
                let oldSelectedDayEl = dayListEl.querySelector('tbody .selected');
                if (oldSelectedDayEl) {
                    oldSelectedDayEl.classList.remove('selected');
                }
                selectedDay.classList.add('selected');

                let oldDay = dayListEl.querySelector('th.selected');
                if (oldDay) {
                    oldDay.classList.remove('selected');
                }

                let currentDay = dayListEl.querySelector('th:nth-child('+ selectedDay.dataset.nth +')');
                currentDay.classList.add('selected');

                this.setNewSelectedDate();
            });
        });
    }

    getNbDaysInMonth(year, month) {
        return new Date(year, month+1,0).getDate();
    }

    setNewSelectedDate() {
        this.selectedDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDay);

        this.showSelectedDate();

        this.inputDateElement.value = this.formatDateForInput();
    }

    showSelectedDate() {
        let resumeYear = this.wrapperCalendar.querySelector('.resumeYear');
        let resumeDayLetter= this.wrapperCalendar.querySelector('.resumeDayLetter');
        let resumeDay = this.wrapperCalendar.querySelector('.resumeDay');
        let resumeMonth = this.wrapperCalendar.querySelector('.resumeMonth');

        resumeYear.innerHTML = this.selectedYear;
        resumeDayLetter.innerHTML = this.listDay[this.selectedDate.getDay()];
        resumeDay.innerHTML = this.selectedDay;
        resumeMonth.innerHTML = this.listMonth[this.selectedMonth];
    }

    formatDateForInput() {
        let year = this.selectedYear;
        let month = ((this.selectedMonth+1) < 10) ? '0'+(this.selectedMonth+1) : (this.selectedMonth+1);
        let day = (this.selectedDay < 10) ? '0'+ this.selectedDay.toString() : this.selectedDay;

        return day + '/' + month + '/' + year;
    }

    navigateAction() {
        this.yearNav.forEach(navEl => {
            navEl.addEventListener('click', event => {
                let action = event.currentTarget.dataset.value;

                if (action === "more") {
                    this.selectedYear += 10;
                } else if (action === "less") {
                    this.selectedYear -= 10;
                }

                this.constructYearList();
                this.setNewSelectedDate();
                this.constructDayList();
            });
        });

    }

    updateDate() {
        // on regarde si le format de la date est valid
        if (!this.inputDateElement.value.match(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)) {
            return;
        }

        let formatedDate = this.inputDateElement.value.split('/').reverse().join('-');
        let newDate = new Date(formatedDate);

        if (!newDate) {
            return;
        }

        this.selectedDay = parseInt(newDate.getDate());
        this.selectedMonth = parseInt(newDate.getMonth());
        this.selectedYear = parseInt(newDate.getFullYear());

        this.constructMonthList();
        this.constructYearList();
        this.constructDayList();
    }

    static init(config) {
        new DatePicker(config);
    }
}

export default DatePicker;