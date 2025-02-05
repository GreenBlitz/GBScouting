import { NavigateFunction } from "react-router-dom";

export default class SectionHandler<
  Section extends string,
  Sections extends Section[]
> {
  private readonly routes: Section[];
  private readonly navigate: (route: Section) => void;

  private currentIndex: number;

  constructor(navigate: (route: Section) => void, routes: Sections) {
    this.navigate = navigate;
    this.routes = routes;
    this.currentIndex = 0;
  }

  getIndex() {
    return this.currentIndex;
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
