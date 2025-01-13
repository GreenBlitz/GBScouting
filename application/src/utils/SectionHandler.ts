import { NavigateFunction } from "react-router-dom";

export default class SectionHandler {
  private readonly routes: string[];
  private readonly navigate: (route: string) => void;

  private currentIndex: number;

  constructor(navigate: (route: string) => void, routes: string[]) {
    this.navigate = navigate;
    this.routes = routes;
    this.currentIndex = 0;
  }

  isFirst() {
    return this.currentIndex === 0;
  }

  isLast() {
    return this.currentIndex === this.routes.length - 1;
  }

  currentRoute() {
    return this.routes[this.currentIndex];
  }

  navigateNext() {
    if (this.isLast()) {
      return;
    }
    this.currentIndex++;
    this.navigate(this.routes[this.currentIndex]);
  }

  navigatePrevious() {
    if (this.isFirst()) {
      return;
    }
    this.currentIndex--;
    this.navigate(this.routes[this.currentIndex]);
  }
}
