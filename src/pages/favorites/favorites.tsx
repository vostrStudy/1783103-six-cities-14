import { Link } from 'react-router-dom';
import { AppRoute } from '../../utils/const';
import { Helmet } from 'react-helmet-async';
import FavoritesListComponent from '../../components/favorites-page/favorites-list-comonent';
import {useAppDispatch, useAppSelector } from '../../hooks';
// import { getFavoriteOffers } from '../../store/actions';
import PageHeader from '../../components/main-page/header/header';
import { getFavoriteOffers } from '../../store/cities-action/selectors';
import { useEffect } from 'react';
import { fetchFavorites } from '../../store/api-api-actions';
import { OffersType } from '../../types/offers-types';

// children: ReactNode; add this type?

type FavoritesProps = {
  offers: OffersType[];
}

function Favorites({offers}:FavoritesProps) {


  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFavorites(offers));
  }, [offers,dispatch]);

  const favorites = useAppSelector(getFavoriteOffers);


  return (

    <div className="page">
      <Helmet>
        <title>6 cities. Favorites</title>
      </Helmet>
      <PageHeader/>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {favorites.map((offer) => (
                <FavoritesListComponent
                  key = {offer.id}
                  offers= {favorites}
                  favoritesCity = {offer.city.name}
                />
              ))}

            </ul>
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Root}>
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width={64}
            height={33}
          />
        </Link>
      </footer>
    </div>
  );
}

export default Favorites;
