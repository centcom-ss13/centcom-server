import Boom from "@hapi/boom/lib/index";

function validateSringLength(input, fieldName, {
  minLength = 0,
  maxLength,
} = {}) {
  if((input === undefined || input === null) && minLength > 0) {
    throw Boom.badRequest(`Field "${fieldName}" must a non-empty string`);
  }

  if(input !== undefined && input !== null) {
    if(input.length < minLength) {
      throw Boom.badRequest(`Field "${fieldName}" must be at least ${minLength} characters`);
    }

    if(maxLength && input.length > maxLength) {
      throw Boom.badRequest(`Field "${fieldName}" must be at most ${maxLength} characters`);
    }
  }
}

function validatePositiveInteger(input, fieldName, {
  nonNull = false,
}) {
  if(nonNull && (input === undefined || input === null)) {
    throw Boom.badRequest(`Field "${fieldName}" must a positive integer`);
  }

  if(input !== undefined && input !== null) {
    if(typeof input !== 'number' || input < 1) {
      throw Boom.badRequest(`Field "${fieldName}" must be a positive integer`);
    }

    if((input - Math.floor(input)) !== 0) {
      throw Boom.badRequest(`Field "${fieldName}" must be a positive integer`);
    }
  }
}

function validateBoolean(input, fieldName, {
  nonNull = false,
}) {
  if(nonNull && (input === undefined || input === null)) {
    throw Boom.badRequest(`Field "${fieldName}" must a boolean`);
  }

  if(input !== undefined && input !== null) {
    if(typeof input !== 'boolean') {
      throw Boom.badRequest(`Field "${fieldName}" must a boolean`);
    }
  }
}

export {
  validateSringLength,
  validatePositiveInteger,
  validateBoolean,
};