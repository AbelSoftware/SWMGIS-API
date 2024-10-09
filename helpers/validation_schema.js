const Joi = require('@hapi/joi');
const createError = require('http-errors');
const { schema } = require('../models/user-model');
const { Schema } = require('mongoose');


const validateParam = (schema, name) => {
    return (req, res, next) => {
        console.log(name,req.params.userid,req['params'][name])
       // const result = schema.validate({ param: req['params'][name] });
        const result = schema.validate({param: req['params'][name]});
        console.log(result)
        if (result.error) {
            throw createError.BadRequest();
        } else {
            if (!req.value)
                req.value = {};

            if (!req.value['params'])
                req.value['params'] = {};
            req.value['params'][name] = result.value.param;
            next();
        }

    }
}

const validateBody = (schema) => {
    return (req, res, next) => {
        
        const result = schema.validate(req.body);
        if (result.error) {
            throw createError.BadRequest();
        } else {
            if (!req.value)
                req.value = {};

            if (!req.value['body'])
                req.value['body'] = {};

            req.value['body'] = result.value;
            next()
        }
    }
}

const schemas = {
    authSchema : Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().min(2).max(15).required(),
    }),
    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}


module.exports = {

    validateParam,
    schemas,
    validateBody
}