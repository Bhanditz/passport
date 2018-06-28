import React,{Component} from "react";

class Modal extends Component {
    render() {
        return (
            <div id="modal" onClick={this.props.toggleModal}>
                <div
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    <div className = "modalTitle">
                        <p>Create Factory</p>
                        <i className="fas fa-window-close" onClick={this.props.toggleModal} />
                    </div>

                    <form onSubmit={(e)=> {
                        e.preventDefault();
                        this.props.toggleModal();
                        this.props.createFactory();
                    }}>
                        <p>Name:</p>
                        <input type="text" name="name" placeholder="Name" maxLength="50"
                               value = {this.props.name} onChange={this.props.handleChange}
                        />
                        <p>Total Nodes:</p>
                        <input
                            type="number"
                            name="totalNodes"
                            placeholder="Number of Nodes"
                            max="15"
                            min="0"
                            onChange={this.props.handleChange}
                            value = {this.props.totalNodes}
                        />
                        <p>Lower Bound:</p>
                        <input type="number" name="lower" placeholder="Lower Bound" min="0"
                               value = {this.props.lower} onChange={this.props.handleChange}
                        />
                        <p>Upper Bound:</p>
                        <input type="number" name="upper" placeholder="Upper Bound" min="1"
                               value = {this.props.upper} onChange={this.props.handleChange}
                        />
                        <div className="submitButton">
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

module.exports = Modal;