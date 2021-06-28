class Accordion {
  constructor(props) {
    this.$wrapper = document.querySelectorAll(props.parent);
    // время анимации у списков
    this.time = 500;
    this.toggleStatusAttribute = props.toggleStatusAttribute;

    /* так как спойлеров будет несколько, запускаем цикл */
    this.$wrapper.forEach((wrapper) => {
      this.handleClick(wrapper);

      /* устанавливаем data атрибуты, необходимые для корректной работы. В будущем, это можно будет делать через backend */
      this.setupToggleDataset(wrapper);

      /* стилизуем последние элементы, у которых не вложенности */
      this.styleLastAccodrions(wrapper);
    });
  }

  handleClick(wrapper) {
    wrapper.addEventListener("click", (event) => this.toggle(event));
  }

  styleLastAccodrions(wrapper) {
    wrapper
      .querySelectorAll(`[${this.toggleStatusAttribute}]`)
      .forEach((el) => {
        if (
          el.querySelectorAll(`[${this.toggleStatusAttribute}]`).length === 0
        ) {
          el.classList.add("lastElement");
        }
      });
  }

  setupToggleDataset(wrapper) {
    this.accordion = wrapper.querySelectorAll(".accordion");
    this.cell = wrapper.querySelectorAll(".accordion__cell");

    /* так как нам нужно установить атрибуты для обоих классов, чтобы не запускать цикл дважды, получим наибольший массив */
    this.biggerlength = Math.max(this.accordion.length, this.cell.length);

    for (let index = 0; index < this.biggerlength; index++) {
      /* исключаем ошибки с отсутствием класса, нулевой элемент и элементы без вложенности */
      if (
        this.accordion[index] &&
        index != 0 &&
        !this.accordion[index].classList.contains("lastElement")
      ) {
        this.accordion[index].setAttribute(this.toggleStatusAttribute, "false");
      }

      /* аналогично */
      if (
        this.cell[index] &&
        !this.cell[index].classList.contains("lastElement")
      )
        this.cell[index].setAttribute(this.toggleStatusAttribute, "false");
    }
  }

  /* закрываем элементы на одном уровне вложенности с активным элементом */
  closeAllOpenedLists(_, parent, event) {
    /* получаем массив текущих активных элементов */
    this.$openedLists = event.currentTarget.querySelectorAll(
      `[${this.toggleStatusAttribute}="true"]`,
    );
    /* сохраняем его */
    this.$prevElement = [].concat(...this.$openedLists);

    /* находим всех соседей и скрываем их */
    if (this.$prevElement.length) {
      const siblings = (elem) => {
        // create an empty array
        let siblings = [];

        // if no parent, return empty list
        if (!elem.parentNode) {
          return siblings;
        }

        // first child of the parent node
        let sibling = elem.parentNode.firstElementChild;

        // loop through next siblings until `null`
        do {
          // push sibling to array
          if (sibling != elem) {
            siblings.push(sibling);
          }
        } while ((sibling = sibling.nextElementSibling));

        return siblings;
      };

      const nodes = siblings(parent);
      nodes.forEach((el) => {
        if (el.getAttribute(this.toggleStatusAttribute) === "true")
          this.hide(
            el.querySelector(`[${this.toggleStatusAttribute}]`),
            el,
            event,
          );
      });
    }
  }

  /* отслеживаем состаяние для вкл/выкл при нажатии */
  toggle(event) {
    /* находим родителя-ячейку у кликнутого элемента */
    this.$parent_cell = event.target.closest(`[${this.toggleStatusAttribute}]`);

    /* отменяем функцию, если кликнули по элементу без вложенности */
    if (this.$parent_cell.classList.contains("lastElement")) return;

    /* находим раскрывающийся список */
    this.$inner_cell = this.$parent_cell.querySelector(
      `[${this.toggleStatusAttribute}]`,
    );

    /* toggle state */
    if (
      this.$parent_cell.getAttribute(this.toggleStatusAttribute) === "false"
    ) {
      this.closeAllOpenedLists("", this.$parent_cell, event);
      this.activate(this.$inner_cell, event);
    } else {
      this.hide(this.$inner_cell, this.$parent_cell, event);
    }
  }

  /* функция раскрытия. Сначала мы получаем необхоимую высоту, потом убираем display none, после чего задаем неограниченную высоту для адекватного ресайза страницы */
  activate(el, event) {
    this.$parent_cell.setAttribute(this.toggleStatusAttribute, "true");
    this.$parent_cell.classList.add("toggleArrow");

    el.classList.add("active");

    Object.assign(el.style, {
      transition: `${this.time * 0.001}s ease`,
      overflow: "hidden",
      maxHeight: "0px",
    });

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        el.style.maxHeight = el.scrollHeight + "px";
        resolve(el);
      }, 0);
    });

    promise.then((el) => {
      setTimeout(() => {
        el.style.removeProperty("max-height");
        el.style.removeProperty("overflow");

        event.stopPropagation();
      }, this.time);
    });
  }

  hide(el, parent = this.$parent_cell, event) {
    Object.assign(el.style, {
      overflow: "hidden",
      maxHeight: el.scrollHeight + "px",
    });

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        el.style.maxHeight = "0";
        resolve(el);
      }, 0);
    });

    setTimeout(() => {
      parent.setAttribute(this.toggleStatusAttribute, "false");
      parent.classList.remove("toggleArrow");
    }, 50);

    promise.then((el) => {
      setTimeout(() => {
        parent.setAttribute(this.toggleStatusAttribute, "false");
        parent.classList.remove("toggleArrow");
        el.classList.remove("active");
        event.stopPropagation();
      }, this.time);
    });
  }
}

const accordion = new Accordion({
  parent: ".spoiler",
  toggleStatusAttribute: "data-list_was_toggled",
});

class ProgressBar {
  constructor(props) {
    this.$wrapper = document.querySelectorAll(props.parent);
    this.$progressBar = props.progressBar;

    this.$wrapper.forEach((el) => {
      this.$allPercentsData = el.querySelectorAll(`[${props.currentPercents}]`);
      this.setUp(this.$allPercentsData, el);
    });
  }

  setUp(arr, el) {
    //   находим прогресс бар в одном элементе с ячейкой
    this.$progressBar_line = el.querySelectorAll(this.$progressBar);

    arr.forEach((el, index) => {
      // получаем число
      this.pureNumber = el.innerHTML.replace(/\D+/g, "");

      // устанавливаем стиль
      this.$progressBar_line[index].style.width = 100 - this.pureNumber + "%";
    });
  }
}

const progressBar = new ProgressBar({
  parent: ".spoiler",
  currentPercents: "data-progressBar",
  progressBar: ".progressBar__activeState",
});
