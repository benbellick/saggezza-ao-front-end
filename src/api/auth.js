import call from './calls';
import storage from '../utils/storage';

export default {
    hasValidToken: (token) => {
        const endpoint = 'validate-token';

        return new Promise((resolve) => {
            call.post(endpoint, token).then((response) => {
                if (response !== 'error') {
                    resolve(response.validToken);
                } else {
                    resolve(false);
                }
            });
        });
    },
    isValidUser: (credentials) => {
        const endpoint = 'login';

        return new Promise((resolve) => {
            let successStatus = false;

            call.post(endpoint, credentials).then((response) => {
                if ('token' in response) {
                    storage.setToken(response.token);
                    storage.setUser(response.firstName);
                    storage.setAdminStatus(response.isAdmin);
                    successStatus = true;
                }
                resolve(successStatus);
            });
        });
    },
    registerUser: (userInfo) => {
        const endpoint = 'register';

        return new Promise((resolve) => {
            let successStatus = false;

            call.post(endpoint, userInfo).then((response) => {
                if ('token' in response) {
                    storage.setToken(response.token);
                    storage.setUser(response.firstName);
                    successStatus = true;
                }
                resolve(successStatus);
            });
        });
    },
    logout: () => {
        storage.clearStorage();
    }
}
