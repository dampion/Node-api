import React, { useEffect } from 'react';

const MyNotes = () => {
  useEffect(() => {
    // 更新文件標題
    document.title = 'My notes- dampion Note';
  })

  return (
    <div>
      <h1>dampion Note</h1>
      <p>These are my notes</p>
    </div>   
  )
}

export default MyNotes;