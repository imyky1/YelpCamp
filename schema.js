const Basejoi = require('joi')//to validate schema(server side validation)
const sanitizeHtml = require('sanitize-html');//will sanitize all the htmlentered b the user
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const joi = Basejoi.extend(extension)

module.exports.campschema = joi.object({
    campground:joi.object({
        title: joi.string().required().escapeHTML(),
        location:joi.string().required().escapeHTML(),
        price:joi.number().required().min(0),
        // image:joi.string().required(),
        description:joi.string().required().escapeHTML()
    }).required(),
    deleteImages:joi.array()
})
module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating : joi.number().required().min(1).max(5),
        body:joi.string().required().escapeHTML()
    }).required()
})