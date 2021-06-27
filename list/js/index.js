class Accordion {
  constructor(props) {
    this.$wrapper = document.querySelectorAll(props.parent);

    this.$wrapper.forEach((wrapper) => {
      this.toggleStatusAttribute = props.toggleStatusAttribute;
      this.handleClick(wrapper);
      this.setupToggleDataset();
      this.styleLastAccodrions(wrapper);
    });
  }

  handleClick(wrapper) {
    wrapper.addEventListener("click", (event) => {
      this.toggle(event);
    });
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

  setupToggleDataset() {
    this.accordion = document.querySelectorAll(".accordion");
    this.cell = document.querySelectorAll(".accordion__cell");

    this.biggerlength = Math.max(this.accordion.length, this.cell.length);

    for (let index = 0; index < this.biggerlength; index++) {
      if (
        this.accordion[index] &&
        index != 0 &&
        !this.accordion[index].classList.contains("lastElement")
      ) {
        this.accordion[index].setAttribute(this.toggleStatusAttribute, "false");
      }

      if (
        this.cell[index] &&
        !this.cell[index].classList.contains("lastElement")
      )
        this.cell[index].setAttribute(this.toggleStatusAttribute, "false");
    }
  }

  closeAllOpenedLists(event) {
    this.$openedLists = event.currentTarget.querySelectorAll(
      `[${this.toggleStatusAttribute}="true"]`,
    );
    this.$prevElement = [].concat(...this.$openedLists);

    console.log(this.$prevElement[0]);

    if (
      this.$prevElement[0] &&
      this.$prevElement[0].closest("[parent='true']") &&
      this.$prevElement[0].closest(`[${this.toggleStatusAttribute}="false]`)
    ) {
      this.hide(
        this.$prevElement[0].querySelector(`[${this.toggleStatusAttribute}]`),
        this.$prevElement[0],
      );
    }
  }

  toggle(event) {
    this.$parent_cell = event.target.closest(`[${this.toggleStatusAttribute}]`);
    if (this.$parent_cell.classList.contains("lastElement")) return;

    this.$inner_cell = this.$parent_cell.querySelector(
      `[${this.toggleStatusAttribute}]`,
    );

    if (
      this.$parent_cell.getAttribute(this.toggleStatusAttribute) === "false"
    ) {
      this.closeAllOpenedLists(event);
      this.activate(this.$inner_cell);
    } else {
      this.hide(this.$inner_cell);
    }
  }

  activate(el) {
    this.$parent_cell.setAttribute(this.toggleStatusAttribute, "true");
    this.$parent_cell.setAttribute("parent", "true");
    this.$parent_cell.classList.add("toggleArrow");
    el.style.maxHeight = el.scrollHeight + "px";
    el.classList.add("active");
  }

  hide(el, parent = this.$parent_cell) {
    el.style.maxHeight = 0;
    el.classList.remove("active");
    parent.setAttribute(this.toggleStatusAttribute, "false");
    parent.classList.remove("toggleArrow");
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
