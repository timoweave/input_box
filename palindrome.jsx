"use strict";

import React from "react";
import ReactDom from "react-dom";

import {
    Panel, Badge,
    Button, ButtonToolbar,
    Form, FormGroup, FormControl, ControlLabel
} from "react-bootstrap";

class Palindrome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            output : "",
            input : "",
            rows : 3,
            disabled : true,
            processed : false
        };

        this.input = this.input.bind(this);
        this.clear = this.clear.bind(this);
        this.find = this.find.bind(this);
        this.palindrome = this.palindrome.bind(this);
        this.multiple_line_split = this.multiple_line_split.bind(this);
    }

    render() {
        const header = (
            <h3>Palindrome</h3>
        );

        const footer = (
            <ButtonToolbar>
              <Button bsStyle="primary"
                      onClick={this.find}
                      disabled={this.state.disabled}>find</Button>
              <div style={{ width: "auto"}}/>
              <Button bsStyle="danger" onClick={this.clear}>clear</Button>
            </ButtonToolbar>
        );

        const input = (
            <Form>
              <FormGroup controlId="inputTextarea">
                <ControlLabel>Input Text</ControlLabel>
                <FormControl componentClass="textarea"
                             rows={this.state.rows} style={{resize: "vertical"}}
                             placeholder="enter text here..."
                             value={this.state.input}
                             onChange={this.input}/>
              </FormGroup>
            </Form>
        );

        const output = (
            <Form>
              <FormGroup controlId="outputParagraph" style={this.styles.output}>
                <ControlLabel>Palindrome Text</ControlLabel>
                <p style={this.styles.content}>
                  {this.state.output}
                </p>
              </FormGroup>
            </Form>
        );

        const container = (
            <div className="container" style={this.styles.container}>
              <div className="row">
                <div className="col-sm-12">
                  <Panel header={header}
                         footer={footer}>
                    {input}
                    {output}
                  </Panel>
                </div>
              </div>
            </div>
        );
        return container;
    }

    clear() {
        this.setState((prevState, props) => ({
            input: "", output : "", disabled : true, processed : false
        }));
    }

    input(e) {
        const value = e.target.value;
        this.setState((prevState, props) => ({
            input: value,
            rows : Math.max(3, value.split("").filter(i => (i === "\n")).length + 1),
            disabled : value.length === 0 ? true : false
        }));
    }

    find() { // find palindrome
        this.setState((prevState, props) => {
            const words = this.multiple_line_split(prevState.input);
            const texts = words.map((w, i) => {
                if (this.palindrome(w)) {
                    const p = (
                        <span key={i} style={this.styles.space}>
                          <Badge style={this.styles.badge}>
                            {w}
                          </Badge>
                        </span>
                    );
                    return p;
                } else if (w === "<br/>") {
                    return (
                        <br key={i}/>
                    );
                } else {
                    return (
                        <span key={i} style={this.styles.space}>
                          {w}
                        </span>
                    );
                }
            });
            return { output: texts, processed : words.length ? true : false };
        });
    }

    multiple_line_split(strings) {
        // NOTE: "↵" is "&crarr;" or unicode \u21B5
        // const words = prevState.input.slice().match(/\u21B5|[^ \u21B5]+/g);
        // const words = prevState.input.slice().match(/↵|[^ ↵]+/g);
        strings = JSON.stringify(strings).slice(1, -1);
        const words = strings.split(" ").reduce((result, word) => {
            const spaced_word = word.replace("\\n", " <br/> ").split(" ");
            result.push(...spaced_word);
            return result;
        }, []);
        return words;
    }

    palindrome(word) {
        const puncts = [".", ",", "?", "!", ":", ";", "\n"];
        while (puncts.includes(word.slice(-1))) {
            word = word.slice(0, -1);
        }
        for (let i = 0, j = word.length - 1; i < j; i++, j--) {
            if (word[i] !== word[j]) {
                return false;
            }
        }
        return true;
    }

    get styles() {
        return {
            container: {
                padding: "2em"
            },
            content : {
                backgroundColor : "#2196f3",
                color: "white",
                padding: "1em",
                borderRadius: "4px"
            },
            output : {
                display : this.state.processed ? "block" : "none"
            },
            badge : {
                backgroundColor : "#17d1d5", color: "lightcyan"
            },
            space : {
                padding: "0 0.25em"
            }
        };
    }
}

ReactDom.render(<Palindrome/>, document.getElementById("app"));
