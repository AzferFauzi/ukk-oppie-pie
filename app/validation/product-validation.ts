import Joi from "joi"

 const getProductValidation = Joi.object({
    name: Joi.string().max(200).required(),
    price: Joi.number().required(),
    description: Joi.string(),
    image: Joi.string(),
    stock: Joi.number(),
})



