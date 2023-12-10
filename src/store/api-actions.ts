import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch,State } from '../types/state';
import { AxiosInstance } from 'axios';
import { OffersType } from '../types/offers-types';
import { APIRoute, AppRoute, TIMEOUT_SHOW_ERROR } from '../utils/const';
import { getReviews, redirectToRoute, setError, setUser } from './actions';
import { AuthData } from '../types/auth-data-type';
import { UserData } from '../types/user-data-types';
import { dropToken, saveToken } from '../services/token';
import { store } from '.';
import { ReviewType } from '../types/reviews-types';


export const fetchOffersAction = createAsyncThunk <OffersType[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    }
  >(
    'offers/fetchOffers',
    async (_arg, {extra:api }) => {
      const {data} = await api.get <OffersType[]> (APIRoute.offers);
      return data;
    },
  );

// add action for displaying  a single offer by id

export const fetchTheOffer = createAsyncThunk <OffersType,OffersType['id'] , {
    dispatch: AppDispatch;
    state: State;
    extra:AxiosInstance;
    }
  >(
    'offer/fetchOffer',
    async (offerId, {extra:api}) => {

      const {data} = await api.get <OffersType> (`${APIRoute.offers}/${offerId}`);
      return data;
    //   dispatch(findTheOffer(data));
    },
  );

// add action for dispalying nearby offers

export const fetchNearbyOffers = createAsyncThunk <OffersType[],OffersType['id'] , {
    dispatch: AppDispatch;
    state: State;
    extra:AxiosInstance;
    }
  >(
    'offer/fetchNearbyOffers',
    async (offerId, {extra:api}) => {

      const {data} = await api.get <OffersType[]> (`${APIRoute.offers}/${offerId}${APIRoute.NearbyOffers}`);
      return data;
    },
  );


// add action for dispalying existing reviews

export const fetchReviews = createAsyncThunk<void, OffersType['id'],{
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}
>(
  '/offer/reviews',
  async (offerId,{dispatch,extra:api}) => {
    const{data} = await api.get <ReviewType[]>(`${APIRoute.Reviews}/${offerId}`);
    dispatch(getReviews(data));
  }
);

// add action to post reviews

// Gotta fix the Favorites page,
//as the favorite offers are not being sent to the server just yet
export const changeToFavorites = createAsyncThunk<OffersType[], OffersType,{
    dispatch: AppDispatch;
    state:State;
    extra:AxiosInstance;
}
>(
  'offers/changeToFavorites',

  async({id,isFavorite}, { extra:api}) => {
    const{data} = await api.post <OffersType[]>(
      `${APIRoute.Favorites}/${id}/${Number(isFavorite)}`
    );
    return data;
  }
);

export const fetchFavorites = createAsyncThunk<OffersType[], OffersType[], {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
  >(
    'favorite/fetchFavorites',
    async (_arg, { extra: api}) => {
      const {data} = await api.get <OffersType[]> (APIRoute.Favorites);
      return data;
    },
  );

export const checkAuthAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
  >(
    'user/checkAuth',
    async (_arg, {extra: api}) => {
      await api.get (APIRoute.Login);

    },
  );

export const loginAction = createAsyncThunk<void, AuthData, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
  >(
    'user/login',
    async ({login: email, password}, {dispatch, extra: api}) => {
      const {data: {token}} = await api.post<UserData>(APIRoute.Login, {email, password});
      saveToken(token);
      dispatch(setUser(email));
      dispatch(redirectToRoute(AppRoute.Root));
    },
  );

export const logoutAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
  >(
    'user/logout',
    async (_arg, {dispatch,extra: api}) => {
      await api.delete(APIRoute.Logout);
      dispatch(redirectToRoute(AppRoute.Login));
      dropToken();
    },
  );

export const clearErrorAction = createAsyncThunk (
  'cities/setError',
  () => {
    setTimeout(
      () => store.dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR,
    );
  },
);
