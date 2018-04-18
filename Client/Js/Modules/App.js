import React from 'react';
import LoginForm from './Core/Login/Components/LoginForm';
import 'milligram/dist/milligram.min.css';

import { Router, RouterComponent, renderMiddleware, resolveMiddleware } from 'webiny-react-router';

const router = new Router();

router.configure({
    middleware: [
        resolveMiddleware(),
        renderMiddleware()
    ]
});

router.addRoute({
    name: '404',
    path: '*',
    render: () => <div>404</div>
});

router.addRoute({
    name: 'login',
    path: '/login',
    exact: true,
    layout: (Element) => <div>{Element}</div>,
    resolve: () => ({leon: true}),
    render: ({ resolve, match, route }) => <LoginForm/>
});

window.router = router;

const App = () => {
    return (
        <RouterComponent router={router}/>
    );
};

export default App;