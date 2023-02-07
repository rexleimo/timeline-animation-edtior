export namespace DomUtils {
  export function setDomScrollLeft(dom: HTMLElement, scrollLeft: number) {
    dom.scrollTo({ left: scrollLeft });
  }
}