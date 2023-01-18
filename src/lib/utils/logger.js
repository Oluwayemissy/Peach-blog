import fs from 'fs';


export const logger = {
    info(message, location) {
        console.log(message, location)
    },

    error(message, location) {
        console.log(message, location)
    }
};
