import { User } from '../../models/user.types';
import { Action } from '../types';

export enum UserActions {
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_USER = 'SET_USER',
  CLEAR_USER = 'CLEAR_USER',
}

export interface UserAction extends Action {
  type: UserActions;
  payload?: any;
} 