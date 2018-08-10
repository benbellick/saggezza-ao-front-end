import storage from '../utils/storage';

const baseURL = 'http://localhost:8000/';

let timeout;

export default {
    get: () => {

    },
    post: (endpoint, payload = {}) => {
        const token = storage.returnToken();

        console.log(token)
        return new Promise((resolve) => {
            timeout = setTimeout(() => {
                resolve('Unable to connect...');
            }, 15000);

            fetch(baseURL + endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(payload)
            }).then((response) => {
                clearTimeout(timeout);

                if (response.ok) {
                    response.json().then((body) => {

                        // Check if we renewed the token.
                        if ('renewedToken' in body) {
                            storage.setToken(body.renewedToken);
                        }

                        console.log(body)
                        resolve(JSON.parse(JSON.stringify(body.payload)));
                    });
                } else {
                    resolve('error');
                }
            }).catch((response) => {
                resolve('error');
            });
        });
    }
}
