export const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    GET_DATA: 'GET_DATA',
    CHANGE_VALUE: 'CHANGE_VALUE',
};

export const login = (userData, token) => {
    if (!userData || !token) return;

    // localStorage.setItem(localStorageKeys.user, JSON.stringify(userData));
    // localStorage.setItem(localStorageKeys.token, token);

    return (dispatch) => {
        dispatch({
            type: actionTypes.LOGIN,
            data: userData,
        });
    }
};

export const logout = () => {
    return (dispatch) => {
        // localStorage.removeItem(localStorageKeys.user);
        dispatch({
            type: actionTypes.LOGOUT
        });
    }
};

// export const getData = (key, id, patch) => {
//     return async (dispatch, getState) => {
//         if (getState().staticData[key].length === 0 || id) {
//             let url = config.apiURL + staticDataUrls[key] + (id ? id : '') + (patch ? patch : '');
//             await axios.get(url).then(res => {
//                 dispatch({
//                     type: actionTypes.GET_DATA,
//                     data: res.data.data ? res.data.data : res.data,
//                     key: key,
//                     id: id
//                 })
//             })
//         }
//     }
// };

export const changeValue = (section, field, value) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.CHANGE_VALUE,
            section: section,
            field: field,
            value: value,
        });
    }
}