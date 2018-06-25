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

module.exports = Modal;