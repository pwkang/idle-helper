import {Handler, Request, Response} from 'express';

export default <Handler[]>[healthCheckSuccess];

function healthCheckSuccess(req: Request, res: Response) {
  res.status(200).send('OK');
}
