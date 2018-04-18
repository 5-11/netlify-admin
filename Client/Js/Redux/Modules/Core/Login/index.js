import { actions } from "./Api/loginActions";
import { reducers } from "./Api/loginReducers";
import { UserLoginFlow as middleware } from "./Api/loginFlow";

export default {
    namespace: '',
    actions,
    reducers,
    middleware
}