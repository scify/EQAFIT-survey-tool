import { event } from "vue-gtag";

export default class AnalyticsLogger {
  instance = null;

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new AnalyticsLogger();
    }
    return this.instance;
  }

  logEvent(eventName, payload) {
    event(eventName, payload);
  }
}
