import { PayloadAction } from '@reduxjs/toolkit';
import { reducer } from '../reducer';
import browserHistory from '../../browser-history';
import {Middleware} from 'redux';

type Reducer = ReturnType<typeof reducer>;

export const redirect: Middleware<unknown, Reducer> =
  () =>
    (next) =>
      (action: PayloadAction<string>) => {
        if (action.type === 'game/redirectToRoute') {
          browserHistory.push(action.payload);
        }

        return next(action);
      };