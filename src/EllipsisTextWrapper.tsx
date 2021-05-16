import React, { Component, CSSProperties } from "react";
import "./EllipsisTextWrapperStyle.css";

interface Props  {
    children: string,
    className?: string,
    numberOfLines?: number,
    style?: CSSProperties,
}

interface State {}

export default class EllipsisText extends Component<Props, State> {
  wrapperRef = React.createRef<HTMLDivElement>();
  lineArray:string[] = [];

  componentDidMount = () => {
    if (this.wrapperRef && this.wrapperRef.current) {
        this.handleEllipsis();
    }
    else {
        const refCheckInterval:ReturnType<typeof setInterval> = setInterval(() => {
            if (this.wrapperRef && this.wrapperRef.current) {
                this.handleEllipsis();
                clearInterval(refCheckInterval)
            } 
        }, 1000)
    }
  };

  handleEllipsis = () => {
    if (!this.wrapperRef || !this.wrapperRef.current) return;
    const {numberOfLines = 1} = this.props;
    const text = this.props.children;
    const wordArray = text.replace(/\s+/g, " ").trim().split(" ");
    for (let i = 0; i < wordArray.length; i++) {
      const word = wordArray[i];
      /**
       * 1. get height of wrapper before appending new word
       * 2. append one word inside dom
       * 3. get height of the wrapper after appneding new word,
       * 4. check if before and after height of wrapper differ ?
       * 5. if differ, then this is a new line
       * 6. else append the words in the same line
       */
      let heightBefore = this.getWrapperHeight();
      this.wrapperRef.current.innerHTML = this.wrapperRef.current?.innerHTML
        .concat(i === 0 ? "" : " ")
        .concat(word);
      const val = this.wrapperRef.current.innerHTML;
      let heightAfter = this.getWrapperHeight();
      if (heightBefore !== heightAfter) {
        /**
         * append in a new line
         */
        this.lineArray.push(val.trimEnd());
      } else {
        /**
         * append in the same line
         */
        const lastIndex = this.getLineArrayEndIndex();
        this.lineArray[lastIndex] = val;
      }

      /**
       * 1. check if height further changes on appending "..." in the end
       * 2. if differs then trim last 3 chars and append "..."
       */
      console.log({text: this.wrapperRef.current.innerHTML, heightAfter})
      const heightWithEllipsis = this.getHeightWithEllipsis();
      console.log({text: this.wrapperRef.current.innerHTML, heightWithEllipsis})
      if (
        heightWithEllipsis !== heightAfter &&
        this.lineArray.length >= numberOfLines
      ) {
        /**
         * trim 3 chars and append "..." in the same line
         */
        const trimTrailingChar = this.wrapperRef.current.innerHTML.slice(0, -3);
        console.log({ trimTrailingChar });
        const lastIndex = this.getLineArrayEndIndex();
        this.lineArray[lastIndex] = trimTrailingChar.trimEnd();
      }
      if (this.lineArray.length > numberOfLines) {
        break;
      }
    }

    console.log({
      lineArray: this.lineArray,
    });

    /**
     * 1. if string is smaller to occupy the lines as per @param numberOfLines,
     * then show the whole text with appended ellipsis.
     *
     * 2. if string can occupy way more lines than the @param numberOfLines,
     * then restrict lines to respect the prop
     */
    this.wrapperRef.current.innerHTML =
     numberOfLines > this.lineArray.length - 1
        ? this.lineArray[this.lineArray.length - 1]
        : this.lineArray[numberOfLines - 1] + "...";
  }

  getWrapperHeight = () => {
    return this.wrapperRef.current?.offsetHeight;
  };

  getLineArrayEndIndex = () => {
    return this.lineArray.length - 1;
  };

  getHeightWithEllipsis = () => {
    if (!this.wrapperRef || !this.wrapperRef.current) return null;
    this.wrapperRef.current.innerHTML = this.wrapperRef.current.innerHTML.concat("...");
    const heightWithEllipsis = this.getWrapperHeight();
    this.wrapperRef.current.innerHTML = this.wrapperRef.current.innerHTML.slice(0, -3);
    return heightWithEllipsis;
  };

  render() {
    const { className } = this.props;
    let classNameProp = className
      ? className
      : ""; /** to prevent undefined or null case */
    return (
        <div
          className={`ellipsis__text__wrapper ${classNameProp}`}
          ref={this.wrapperRef}
          style={{...this.props.style}}
        >
        </div>
    );
  }
}
