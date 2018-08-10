const tokenKeyName = 'aotoken',
    userFirstNameKeyName = 'aoUserFirstName',
    adminStatusKeyName = 'adminStatus';

export default {
    setToken: (token) => {
        window.localStorage.setItem(tokenKeyName, token);
    },
    returnToken: () => {
        return window.localStorage.getItem(tokenKeyName);
    },
    clearToken: () => {
        window.localStorage.removeItem(tokenKeyName);
    },
    setUser: (firstName) => {
        window.localStorage.setItem(userFirstNameKeyName, firstName);
    },
    returnUser: () => {
        return window.localStorage.getItem(userFirstNameKeyName);
    },
    setAdminStatus: (isAdmin) => {
        window.localStorage.setItem(adminStatusKeyName, isAdmin);
    },
    returnAdminStatus: () => {
        return window.localStorage.getItem(adminStatusKeyName) !== 'true' ? false : true;
    },
    clearStorage: () => {
        window.localStorage.clear();
    }
}
