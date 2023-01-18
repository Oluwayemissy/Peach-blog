import { 
    devENV, testENV, prodENV
}  from './env';

const { NODE_ENV } = process.env;

export default {
    production: prodENV,
    development: devENV,
    test: testENV,
} [NODE_ENV];