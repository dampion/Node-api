import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { GET_MY_FAVORITES } from '../gql/query';

const Favorites = () => {
  // effect 讓我們將副作用納入元件中，更新與元件本身無關的內容
  useEffect(() => {
    // 更新文件標題
    document.title = 'Favorites - dampion Note';
  })

  const { loading, error, data } = useQuery(GET_MY_FAVORITES);

  if (loading) return 'Loading';
  if (error) return `Error${error.message}`;

  if (data.me.favorites.length !== 0) {
    return <NoteFeed notes={data.me.favorites} />;
  } else {
    return <p>No favorites yet</p>;
  }
}

export default Favorites;