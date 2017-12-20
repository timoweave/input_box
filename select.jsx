"use strict";

import React from "react";
import ReactDom from "react-dom";

class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textarea : "",
            input : ""
        };
        this.handleSumbit.bind(this);
        this.handleTextarea.bind(this);
        this.handleInput.bind(this);
    }

    handleSumbit(e) {
        e.preventDefault();
        console.log(this.state);
    }

    handleInput(e) {
        this.setState({
            input : e.target.value
        });
    }

    handleTextarea(e) {
        this.setState({
            textarea : e.target.value
        });

    }

    render() {
        return (
            <form onSubmit={this.handleSumbit.bind(this)}>
              <textarea rows="10"
                        style={{display: "block"}}
                        value={this.state.textarea}
                        onChange={this.handleTextarea.bind(this)}></textarea>
              <input type="text"
                     value={this.state.input}
                     style={{display: "block"}}
                     onChange={this.handleInput.bind(this)}/>
              <input type="submit"
                     value="Submit"/>
            </form>
        );
    }
}

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected : "coconut",
            options : [ { value : "grapefruit", label : "Graphfruit" },
                        { value : "lime", label : "Lime" },
                        { value : "conconut", label : "Coconut" },
                        { value : "mango", label : "Mango" } ]
        };
        this.handleSelect.bind(this);
    }

    handleSelect(e) {
        this.setState({
            selected : e.target.value
        });
    }

    render() {
        return (
            <div>
              <select value={this.state.selected}
                      onChange={this.handleSelect.bind(this)}>
                { this.state.options.map((opt, idx) => (
                    ((opt.value === this.state.selected)
                     ? (<option key={opt.value}
                                value={opt.value}
                                selected="selected">
                            {opt.label}
                        </option>)
                     : (<option key={opt.value}
                                value={opt.value}>
                            {opt.label}
                        </option>))
                ))}
              </select>
            </div>
        );
    }
}

ReactDom.render(
    (<div>
       <Form/>
       <Select/>
     </div>
), document.getElementById("app"));
