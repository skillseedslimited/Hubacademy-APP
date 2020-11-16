import event from './event'

const Reducer = (state, action) => {
    switch (action.type) {
        case event.SET_MESSAGES:
            return {
                ...state,
                messages: action.payload
            };
        case event.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages,action.payload]
            };
        case event.SET_PENDINGMESSAGES:
            return {
                ...state,
                pendingMessages: action.payload
            };
        case event.ADD_PENDINGMESSAGES:
            return {
                ...state,
                pendingMessages: [...state.pendingMessages,action.payload]
            };
        case event.REMOVE_PENDINGMESSAGES:
            return {
                ...state,
                pendingMessages: state.pendingMessages.filter(message => message.id !== action.payload)
            };
        case event.SET_CONNECTION:
            return {
                ...state,
                connection: action.payload
            };
        case event.SET_CONVERSATIONSLOAD:
            return {
                ...state,
                conversationsload: action.payload
            };
        case event.SET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;