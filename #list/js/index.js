class Accordion {
  constructor(props) {
    this.$wrapper = document.querySelectorAll(props.parent);
    // время анимации у списков
    this.time = 500;
    this.toggleStatusAttribute = props.toggleStatusAttribute;

    this.$wrapper.forEach((wrapper) => {
      this.handleClick(wrapper);
      this.setupToggleDataset();
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

  closeAllOpenedLists(inner, parent, event) {
    this.$openedLists = event.currentTarget.querySelectorAll(
      `[${this.toggleStatusAttribute}="true"]`,
    );
    this.$prevElement = [].concat(...this.$openedLists);

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

      // get all all siblings
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

  toggle(event) {
    this.$parent_cell = event.target.closest(`[${this.toggleStatusAttribute}]`);
    if (this.$parent_cell.classList.contains("lastElement")) return;

    this.$inner_cell = this.$parent_cell.querySelector(
      `[${this.toggleStatusAttribute}]`,
    );

    if (
      this.$parent_cell.getAttribute(this.toggleStatusAttribute) === "false"
    ) {
      this.closeAllOpenedLists(this.$inner_cell, this.$parent_cell, event);
      this.activate(this.$inner_cell, event);
    } else {
      this.hide(this.$inner_cell, this.$parent_cell, event);
    }
  }

  activate(el, event) {
    this.$parent_cell.setAttribute(this.toggleStatusAttribute, "true");
    this.$parent_cell.classList.add("toggleArrow");
    el.style.transition = `${this.time * 0.001}s ease`;
    el.style.overflow = "hidden";
    el.classList.add("active");
    el.style.maxHeight = 0;
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
    el.style.maxHeight = el.scrollHeight + "px";
    el.style.overflow = "hidden";

    console.log(el, "el");

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
