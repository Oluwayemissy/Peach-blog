const validateData = (schema, type) => async (req, res, next) => {
    try {
      const getType = {
        payload: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        files: req.files,
      };
      const data = getType[type];
      const options = { language: { key: '{{key}} ' } };
      const valid = await schema.validate(data, options);
      if (valid.error) {
        const { message } = valid.error.details[0];
        return res.status(422).json({
           status: 'error',
           message:  message.replace(/["]/gi, '')
        })
      }
    } catch (error) {
      console.log(error)
      return error;
    }
    return next();
  };
  export default validateData;
  
  
  
  
  
  
  
  
  
  
  