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
                    <form onSubmit={(e)=> {
                        e.preventDefault();
                        this.props.toggleModal();
                        this.props.createFactory();
                    }}>
                        <input type="text" name="name" placeholder="Name"
                               value = {this.props.name} onChange={this.props.handleChange}
                        />
                        <input
                            type="number"
                            name="totalNodes"
                            placeholder="Number of Nodes"
                            max="15"
                            min="0"
                            onChange={this.props.handleChange}
                            value = {this.props.totalNodes}
                        />
                        <input type="number" name="upper" placeholder="Upper Bound" min="1"
                               value = {this.props.upper} onChange={this.props.handleChange}
                        />
                        <input type="number" name="lower" placeholder="Lower Bound" min="0"
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

module.exports = Modal;