import {REFLECTIONS,REFLECTION_FOR_TODAY} from "../type";


// export const list = () => async dispatch => {

//     httpClientGet("reflection/list")
//         .then(res=>{

//         return dispatch({
//             type: REFLECTIONS,
//             payload: res.data
//         })
//     }).catch(e=>{
//         return dispatch({
//             type: REFLECTIONS,
//             payload: undefined

//         })
//     })
// }

export const today = () => async dispatch => {
    fetch('https://lshub.herokuapp.com/api/v1/reflection/today', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtaUBlbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJFbWVrYSIsImlhdCI6MTU4MDMxOTczMCwiZXhwIjoxNTgwMzIzMzMwfQ.TvRqz0q-SbXZD1weC5iBGbU4-R3G0jqjGG_1PdALvV4',
            },
    }).then((response) => response.json())
    .then((res) => {
        return dispatch({
            type: REFLECTION_FOR_TODAY,
            payload: res
        })
    }).catch((error) => {
        return dispatch({
            type: REFLECTION_FOR_TODAY,
            payload: error
        })
    });
}