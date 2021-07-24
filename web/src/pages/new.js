import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
// import NoteForm
import NoteForm from '../components/NoteForm';

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
    onCompleted: data => {
      // 完成時，將使用者重新導向至註記頁面
      props.history.push(`note/${data.newNote.id}`);
    }
  })

  return <NoteForm />;
}

export default NewNote;
