import { actions } from "./Api/SignUpActions";
import { reducers } from "./Api/SignUpReducers";
import { SignUpFlow as middleware } from "./Api/SignUpFlow";

export default {
    namespace: '',
    actions,
    reducers,
    middleware
}