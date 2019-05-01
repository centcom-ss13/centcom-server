import Boom from '@hapi/boom';

import {
  validateSringLength,
  validatePositiveInteger,
  validateBoolean,
} from "./utils";

const MAX_JOB_BYOND_KEY_LENGTH = 100;
const MAX_JOB_REASON_LENGTH = 1000;
const MAX_JOB_IP_LENGTH = 15;
const MIN_JOB_IP_LENGTH = 15;
const MAX_JOB_COMPUTER_ID_LENGTH = 100;

function validateBan({ byond_key, reason, expiration_date, active, ip, computer_id}, sender_id) {
  validateSringLength(byond_key, 'byond_key', { minLength: 1, maxLength: MAX_JOB_BYOND_KEY_LENGTH });
  validateSringLength(reason, 'reason', { minLength: MIN_JOB_IP_LENGTH, maxLength: MAX_JOB_REASON_LENGTH });
  validateSringLength(ip, 'ip', { maxLength: MAX_JOB_IP_LENGTH });
  validateSringLength(computer_id, 'computer_id', { maxLength: MAX_JOB_COMPUTER_ID_LENGTH });
  validatePositiveInteger(sender_id, 'sender_id', { nonNull: true });
  validateBoolean(active, 'active', { nonNull: true });
}

export { validateBan }