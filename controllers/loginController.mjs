import * as LoginModel from '../models/login.mjs';

export const loginClient = (req, res) => {
    console.log(req.body)
    const loginDetails = {
        usernameOrEmail: req.body.username,
        password: req.body.password
    };
    console.log(loginDetails)

    LoginModel.authenticateClient(loginDetails, (err, client) => {
        if (err) {
            console.error('Error during client authentication', err);
            return res.status(500).json({ message: 'Error during authentication process' });
        }

        if (client) {
            // Aquí puedes agregar lógica adicional, como la generación de tokens JWT si lo necesitas
            res.status(200).json({
                message: 'Authentication successful',
                client: client
            });
        } else {
            res.status(401).json({ message: 'Authentication failed. Invalid username or password.' });
        }
    });
};


export const loginAdmin = (req, res) => {
    console.log(req.body)
    const loginDetails = {
        username: req.body.username,
        password: req.body.password
    };
    console.log(loginDetails)

    LoginModel.authenticateAdmin(loginDetails, (err, admin) => {
        if (err) {
            console.error('Error during admin authentication', err);
            return res.status(500).json({ message: 'Error during authentication process' });
        }

        if (admin) {
            // Aquí puedes agregar lógica adicional, como la generación de tokens JWT si lo necesitas
            res.status(200).json({
                message: 'Authentication successful',
                admin: admin
            });
        } else {
            res.status(401).json({ message: 'Authentication failed. Invalid username or password.' });
        }
    });
};
