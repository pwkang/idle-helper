import {Handler, NextFunction, Request, Response} from 'express';
import {validatePatreonWebhook} from '../../utils/patreon/webhook';

const validatePatreonSignature: Handler = (req, res, next) => {
  const isValid = validatePatreonWebhook(req);
  if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
  next();
};

const respondOK: Handler = (req, res) => {
  res.send('OK');
};

export default <Handler[]>[validatePatreonSignature, respondOK];
