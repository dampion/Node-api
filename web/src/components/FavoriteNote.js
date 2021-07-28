import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { TOGGLE_FAVORITE } from '../gql/mutation';
import { GET_MY_NOTES } from '../gql/query';
import ButtonAsLink from './ButtonAsLink';

const FavoriteNote = props => {
    const [count, setCount] = useState(props.favoriteCount);

    const [favorited, setFavorited] = useState(
      // check note is toggled
      props.me.favorites.filter(note => note.id === props.noteId).length > 0
    );

    // toggleFavorite 變動 hook
    const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
      variables: {
        id: props.noteId
      },
      // refeatch getmynotes
      refetchQueries: [{ query: GET_MY_NOTES }]
    })

    return (
      <React.Fragment>
        {
          favorited ? (
            <ButtonAsLink
              onClick={() => {
                toggleFavorite()
                setFavorited(false);
                setCount(count - 1);
              }}
            >
              Remove favorite
            </ButtonAsLink>
          ) : (
            <ButtonAsLink
              onClick={() => {
                toggleFavorite()
                setFavorited(true);
                setCount(count + 1);
              }}
            >
              Add favorite
            </ButtonAsLink>
          )
        }
        : {count}
      </React.Fragment>
    )
}

export default FavoriteNote;