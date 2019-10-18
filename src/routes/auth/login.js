import * as api from 'api.js';

export function post(req, res) {
    console.log('req.body = '+req.body);
    const user = req.body;

    api.post('users/login', { user }).then(response => {
        if (response.user) req.session.user = response.user;
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify(response));
    });
}
