import axios from 'axios';
import {logger} from './logger';
import {stringify} from 'json-bigint';

interface ICreateJsonBinResponse {
  url: string;
}

// const url = 'http://localhost:8080/api/create';
const url = 'https://json-bin.pwkang.me/api/create';
export const createJsonBin = async (json: Record<any, any>) => {
  try {
    const response = await axios.post(url, {
      json: stringify(json)
    });
    return response.data as ICreateJsonBinResponse;
  } catch (e: any) {
    logger({
      logLevel: 'error',
      message: e,
      variant: 'create-json-bin'
    });
  }
};
