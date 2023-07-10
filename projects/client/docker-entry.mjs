import { spawn } from 'child_process';

const port = process.env.port || 8080;

spawn(`npx next start -p ${port}`);
