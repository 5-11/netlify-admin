import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from 'react-hot-loader';
import App from './Modules/App';
import { Provider } from 'react-redux';
import { store } from "./Redux";

const RootElement = () => {
    return (
        <Provider store={store}>
            <AppContainer>
                <App/>
            </AppContainer>
        </Provider>
    );
};

ReactDOM.render(<RootElement/>, document.getElementById("root"));

module.hot.accept();
// Webpack Hot Module Replacement API
/*if (module.hot) module.hot.accept('./Components/App', () => render(App));*/
