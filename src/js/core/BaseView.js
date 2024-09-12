import domUpdater from "../lib/domUpdater";

class BaseView {
  update(data, options) {
    this._data = data;
    const markup = this._generateMarkup(this._data);
    domUpdater.update(this._parentElement, markup, options);
  }

  render(data) {
    this._data = data;
    const markUp = this._generateMarkup(this._data);
    this._parentElement.innerHTML = markUp;
  }
}

export default BaseView;
