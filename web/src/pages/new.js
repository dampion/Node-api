import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
// import NoteForm
import NoteForm from '../components/NoteForm';
import { GET_NOTES, GET_MY_NOTES } from '../gql/query';

// 新的註記查詢
const NEW_NOTE = gql`
  mutation newNote($content: String!) {
    newNote(content: $content) {
      id
      content
      createdAt
      favoriteCount
      favoritedBy {
        id
        username
      }
      author {
        username
        id
      }
    }
  }
`

const NewNote = props => {
  useEffect(() => {
    // 更新文件標題
    document.title = 'New Note - dampion'
  });

  const [data, { loading, error }] = useMutation(NEW_NOTE, {
    // 重新擷取 GET_NOTES 查詢以更新快取
    refetchQueries: [{ query: GET_MY_NOTES }, { query: GET_NOTES }],
    onCompleted: data => {
      // 完成時，將使用者重新導向至註記頁面
      props.history.push(`note/${data.newNote.id}`);
    }
  })

  return (
    <React.Fragment>
      {loading && <p>Loading...</p>}
      {error && <p>Error saving the note</p>}
      {/* Component with props, access like props.action => data */}
      <NoteForm action={data} />
    </React.Fragment>
  );
}

export default NewNote;
