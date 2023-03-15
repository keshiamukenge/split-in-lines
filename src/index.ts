type SelectorType = string | HTMLElement | null;
type TextAlignType = 'left' | 'right' | 'center';

export default class SplitInLines {
  element: HTMLElement | null;
  selector: SelectorType;
  textAlign: TextAlignType;
  elementParameters: {
    el: HTMLElement;
    text: string;
    width: number;
  };
  spans: {
    el: HTMLElement;
    top: number;
  }[];
  lines: string[];
  isFirstResize: boolean;
  words: string[];

	constructor(selector: SelectorType, textAlign: TextAlignType = 'left') {
    this.element = null;
    this.selector = selector;
    this.textAlign = textAlign;
    
    if(typeof this.selector === 'string') { 
		  this.element = document.querySelector(this.selector);
    } else {
      this.element = this.selector;
    }
    
    if(!this.element) return;
    
		this.element.style.display = "flex";
		this.element.style.flexWrap = "wrap";

		this.elementParameters = {
			el: this.element,
			text: this.element.innerText,
      width: this.element.getBoundingClientRect().width
		};
		this.spans = [];
		this.lines = [];
    this.isFirstResize = true;

		this.splitAndWrapWords();
		this.setSpansTop();
		this.createLines();
		this.injectInHtml();

    this.elementParameters.el.style.justifyContent = this.textAlign;

    this.onWindowResize();
	}

	private splitAndWrapWords() {
		this.words = this.elementParameters.text.split(/(\s+)/);

		this.words.forEach(word => {
			const span = document.createElement("span");
			span.style.paddingRight = '0.15rem';
  		span.textContent = word;
      
			this.spans = [
				...this.spans,
				{
					el: span,
          top: 0,
				}
			];
      
			this.elementParameters.el.append(span);
		});
	}

	private setSpansTop() {
    if(this.spans.length === 0) return;
    
    this.spans.forEach(item => item.top = item.el.getBoundingClientRect().top);
	}

	private createLines() {
		let newLine = "";
		let currentLineId = 0;

		for(let i = 0; i < this.spans.length; i++) {
			let currentId = i;
			let prevId = i === 0 ? i : i - 1;
      
      
      if(this.spans[prevId].top < this.spans[currentId].top) {
        this.lines = [...this.lines, newLine];
        
        newLine = this.spans[currentId].el.textContent || "";
        this.lines[currentLineId] = this.lines[currentLineId].trim()
        currentLineId += 1;
      } else {
        newLine += this.spans[i].el.textContent;
      }
		}

		this.lines = [...this.lines, newLine];
		this.lines[currentLineId] = this.lines[currentLineId].trim()
	}

	private injectInHtml() {
    let newHtmlElement: HTMLElement | null = null;
    
    if(typeof this.selector === 'string') {
		  newHtmlElement = document.querySelector(this.selector);
     } else {
      newHtmlElement = this.selector;
     }
    
    if(!newHtmlElement) return;

		 newHtmlElement.textContent = "";

		 this.lines.forEach(line => {
			 const spanContent = document.createElement("span");
			 spanContent.style.display = "block";
			 spanContent.textContent = line + '\xa0';
			
			 const spanContainer = document.createElement("span");
			 spanContainer.style.overflow = "hidden";
			 spanContainer.style.display = "block";
			 spanContainer.append(spanContent);

			 newHtmlElement?.append(spanContainer)
		 })
	}
  
  private onWindowResize() {
    let elementBaseWidth = this.isFirstResize ? this.elementParameters.width : this.elementParameters.el.getBoundingClientRect().width;
    
    window.addEventListener('resize', () => {
      let currentElementWidth = this.elementParameters.el.getBoundingClientRect().width;
      
      if(elementBaseWidth !== currentElementWidth) { 
        this.elementParameters.el.replaceChildren();
        
        this.spans.forEach(span => {
          this.elementParameters.el.append(span.el);
          span.top = span.el.getBoundingClientRect().top;
        });

        this.lines = [];
        this.createLines();
        this.injectInHtml()

        elementBaseWidth = currentElementWidth;
      }
      
      if(this.isFirstResize) {
        this.isFirstResize = false;
      }
    })
  }
}