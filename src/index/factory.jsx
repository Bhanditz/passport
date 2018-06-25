import React,{Component} from "react";

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

module.exports = Factory;