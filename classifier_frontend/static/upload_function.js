import React from "react";
import ReactDOM from "react-dom";

'use strict';

const e = React.createElement;

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return 'You liked this.';
        }

        setImagePath = e => {
            let reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])


            reader.onload = () => {
                console.log(reader.result);
                this.setState({
                    queryImage: reader.result
                })
            }
        }

        return e(
            'button',
            { onClick: () => this.setState({ liked: true }) },
            'Like'
        );
    }

}

const domContainer = document.querySelector('#upload_function_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Test));