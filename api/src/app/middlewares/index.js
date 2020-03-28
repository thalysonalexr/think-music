import { authMiddleware as auth } from './auth';
import { authorizationMiddleware as authorization} from './authorization';
import { unprocessableMiddleware as unprocessable } from './unprocessable';

export default {
  auth,
  authorization,
  unprocessable
};
