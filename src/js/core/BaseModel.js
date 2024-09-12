class BaseModel {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

export default BaseModel;
