import Render from '../render.jsx';
import React, { Component } from 'react';
import Factory from './factory.jsx';
import Modal from './modal.jsx';

import "./index.scss";

class App extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            totalNodes: 5,
            upper: 200,
            lower: 0,

            modalState: false,
            factories: []
        };
        this.createFactory = this.createFactory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);

        //Directs to them main change and creates a websocket desu
        const ws = this.ws = new WebSocket(`ws://${location.hostname}:3001`);

        ws.onmessage = (message) => {
            message = JSON.parse(message.data);
            switch (message.event) {

                case "update":
                    this.setState({
                        factories: message.factories
                    });
                    break;
                case "error":
                    alert(message.desc);
                    break;

            }

        }

    }

    //Generic handle state function
    handleChange(e) {

        const name = e.target.name;
        let value = e.target.value;

        if (name === "nodes") {
            if (value > 15)
                value = 15;
            if (value < 0)
                value = 0;
        }

        this.setState({
            [name]: value
        })
    }

    //Send websocket request to create a new Factory
    createFactory() {
        this.ws.send(JSON.stringify({
            event: "createFactory",
            name: this.state.name,
            totalNodes: this.state.totalNodes,
            upper: this.state.upper,
            lower: this.state.lower
        }))
    }

    //Toggle modal's display status
    toggleModal() {
        this.setState(prevState => {
            return { modalState: !prevState.modalState };
        });
    }

    render() {
        return (
            <div className="app">
                <link
                    rel="stylesheet"
                    href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
                    integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
                    crossorigin="anonymous"
                />
                {this.state.modalState ? (
                    <Modal
                        toggleModal={this.toggleModal}
                        createFactory={this.createFactory}
                        handleChange={this.handleChange}
                        name={this.state.name}
                        totalNodes={this.state.totalNodes}
                        upper={this.state.upper}
                        lower={this.state.lower}
                    />
                ) : ("")}
                <div id="rootList">
                    <h4>Root</h4>
                    <div className="Button" onClick={this.toggleModal}>
                        <h5>Create Factory</h5>
                    </div>
                </div>
                <ul>
                    {this.state.factories.map(factory => {
                        return <Factory factory={factory}
                                        ws = {this.ws}
                                />;
                    })}
                </ul>
            </div>
        );
    }
}

Render(App);