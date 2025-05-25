import types from "./Types";
const MiReducer = (state={},action) => {
 switch (action.type) {
    case types.login:
        return {
            logeado:true,
            usuario:action.usuario
        }
    case types.logout:
        return {
            logeado:false,
            usuario:null
        }
    default:
        return state;
 }
}

export default MiReducer;
