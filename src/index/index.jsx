import Render from '../render.jsx';
import React, { Component } from 'react';

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
        this.setState({
            [e.target.name]: e.target.value
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

class Factory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.factory.name,
            editName: false
        };
        this.updateFactory = this.updateFactory.bind(this);
        this.removeFactory = this.removeFactory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //Send websocket request to update a Factory's name
    updateFactory() {
        this.props.ws.send(JSON.stringify({
            event: "updateFactory",
            name: this.state.name,
            uid: this.props.factory.uid
        }))
    }

    //Send websocket request to remove a factory
    removeFactory() {
        this.props.ws.send(JSON.stringify({
            event: "removeFactory",
            uid: this.props.factory.uid
        }))
    }

    toggleEdit() {
        this.setState((prevState) => {
           return {editName: !prevState.editName}
        });
    }

    closeEdit() {
        this.setState({
            editName: false
        })
    }

    render() {
        return (
            <li className="factory">
                <div>
                    {this.state.editName ? <input name="name" value={this.state.name} onChange={this.handleChange} type="text"/>
                        : <p>{this.props.factory.name}</p>}
                    {/*FontAwesome icons used for buttons */}
                    {this.state.editName ? <i className="fas fa-check" onClick={()=> {
                        this.toggleEdit();
                        this.updateFactory();
                    }} /> :
                        <i className="fas fa-edit" onClick={this.toggleEdit} />}
                    <i className="fas fa-trash" onClick={() => {
                        this.closeEdit();
                        this.removeFactory();
                    }} />
                </div>
                <ul>
                    {this.props.factory.nodes.map(number => {
                        return <li>{number}</li>;
                    })}
                </ul>
            </li>
        );
    }
}

class Modal extends Component {
    render() {
        return (
            <div id="modal" onClick={this.props.toggleModal}>
                <div
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    <form onSubmit={(e)=> {
                        e.preventDefault();
                        this.props.toggleModal();
                        this.props.createFactory();
                    }}>
                        <input type="text" name="name" placeholder="Name"
                               value = {this.props.name} onChange={this.props.handleChange}
                        />
                        <input
                            type="text"
                            name="totalNodes"
                            placeholder="Number of Nodes"
                            onChange={this.props.handleChange}
                            value = {this.props.totalNodes}
                        />
                        <input type="text" name="upper" placeholder="Upper Bound"
                               value = {this.props.upper} onChange={this.props.handleChange}
                        />
                        <input type="text" name="lower" placeholder="Lower Bound"
                               value = {this.props.lower} onChange={this.props.handleChange}
                        />
                        <input
                            type="submit"
                            value="Submit"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

Render(App);