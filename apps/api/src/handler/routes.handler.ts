import {handlerFileFilter, handlerRoot} from './constant';
import {type Handler, Router} from 'express';
import {importFiles, logger} from '@idle-helper/utils';

const methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch',
} as const;

export default async function loadRoutes() {
  const router = Router();
  const commands = await importFiles<Handler[]>({
    path: `./${handlerRoot}/routes`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  commands.forEach(({data, path}) => {
    if (!data?.length) return;
    const routePath = '/' + path.replace(/\w+\.ts$/, '').replace(/\/$/g, '');
    const method = path.match(/\w+\.ts$/)?.[0].replace(/\.ts$/, '') as keyof typeof methods;
    if (!Object.values(methods).some((_method) => _method === method)) return;
    if (!router[method]) throw new Error(`Method ${method} not found`);
    logger({
      message: `${method.toUpperCase()} ${routePath}`,
    });
    router[method](routePath, data);
  });
  return router;
}
