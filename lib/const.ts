
import { join as pathJoin } from 'path';



export const EPSAGON_HANDLERS_DIR: string = pathJoin('.', 'epsagon_handlers') || pathJoin(__dirname, 'epsagon_handlers');
