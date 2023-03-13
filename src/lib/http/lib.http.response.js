import status from 'http-status'
import enums from '../enums'
import logger from '../../config/logger'

const { SERVER_ERROR } = enums

export default {
    success: (res, message, code, data) => res.status(code).json({
        status: 'success',
        message,
        code,
        data: data || [],
    }),
    
    error: (res, message = '', code = 500, label = '') => {
        const msg = code === 500 ? SERVER_ERROR : message;
        logger.log(`${message} - ${code} - ${label}`);
        return res.status(code).json({
          status: 'error',
          error: status[`${code}_NAME`],
          message: msg,
          code,
        });
    },
};