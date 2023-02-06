export namespace DomUtils {
  export function setDomScrollLeft(dom: HTMLElement, scrollLeft: number) {
    dom.scrollBy({ left: scrollLeft });
  }
}