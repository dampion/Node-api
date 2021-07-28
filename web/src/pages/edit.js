import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client'

// import GET_NOTE from query.js
import { GET_NOTE, GET_ME } from '../gql/query';
import NoteForm from '../components/NoteForm';
import { EDIT_NOTE } from '../gql/mutation';

const EditNote = props => {
  // 將在url找到的id儲存為變數
  const id = props.match.params.id
  // define get_note query
  const { loading, error, data } = useQuery(GET_NOTE, { variables: { id }});
  // 擷取目前使用者的資料
  const { data: userData } = useQuery(GET_ME);
  // define the change of the note
  const [editNote] = useMutation(EDIT_NOTE, {
    variables: {
      id
    },
    onCompleted: () => {
      props.history.push(`/note/${id}`);
    }
  })

  if (loading) return 'Loading...'
  if (error) return <p>Error! Note not found.</p>
  // 若目前使用者與註記作者不符
  if (userData.me.id !== data.note.author.id) {
    return <p>You do not have access to edit this Note.</p>;
  }
  return <NoteForm content={data.note.content} action={editNote} />
}

export default EditNote;