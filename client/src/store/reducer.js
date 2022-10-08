import { actionTypes } from './action';

export const initialState = {
    isAuth: !!localStorage.getItem('shorty-url-user'),
    app_theme: 0,
    isLoading: {
        action: false,
        page: false,
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.LOGIN:
            return Object.assign({}, state, {
                isAuth: true,
                user: { ...action.data },
            })

        case actionTypes.LOGOUT:
            return Object.assign({}, state, {
                isAuth: false,
                user: null,
            })

        case actionTypes.GET_DATA:
            if (!action.id) {
                return Object.assign({}, state, {
                    staticData: {
                        ...state.staticData,
                        [action.key]: action.data
                    }
                })
            } else {
                return Object.assign({}, state, {
                    staticData: {
                        ...state.staticData,
                        [action.key]: {
                            ...state.staticData[action.key],
                            [action.id]: action.data
                        }
                    }
                })
            }

        case actionTypes.CHANGE_VALUE:
            if (action.value !== undefined) {
                if (action.field) {
                    return Object.assign({}, state, {
                        [action.section]: {
                            ...state[action.section],
                            [action.field]: action.value,
                        }
                    })
                } else {
                    return Object.assign({}, state, {
                        [action.section]: action.value
                    })
                }
            } else {
                return Object.assign({}, state, {
                    [action.section]: {
                        ...state[action.section],
                        update: Date.now()
                    }
                })
            }

        default:
            return state
    }
}

export default reducer
