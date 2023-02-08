export namespace DomUtils {

  export function setDom(dom: HTMLElement) {
    return (fn: Function, ...args: any[]) => {
      fn(dom, ...args);
    }
  }

  export function setDomScrollLeft(dom: HTMLElement, scrollLeft: number) {
    dom.scrollTo({ left: scrollLeft });
  }

  export function hasClassName(dom: HTMLElement, className: string) {
    const hasClassName = dom.classList.contains(className);
    return hasClassName;
  }

}