export default class Cell
{
    #htmlElement;
    #populated;
    #cellNumber;

    constructor(parent, cellNumber)
    {
        parent.append("<div></div>");
        this.#htmlElement = parent.children("div:last-child");
        this.#populated = false;
        this.#cellNumber = cellNumber;
        const clickedOnFieldEvent = new CustomEvent("clickedOnFieldEvent", {
            detail: this
        });
        this.#htmlElement.on("click", () => {
            window.dispatchEvent(clickedOnFieldEvent);
        });
    }

    get populated()
    {
        return this.#populated;
    }

    get cellNumber()
    {
        return this.#cellNumber;
    }

    toggle()
    {
        this.#htmlElement.toggleClass("populated");
        this.#populated = !this.#populated;
    }
}