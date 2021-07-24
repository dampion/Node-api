import React, { useEffect } from 'react';

const Favorites = () => {
  // effect 讓我們將副作用納入元件中，更新與元件本身無關的內容
  useEffect(() => {
    // 更新文件標題
    document.title = 'Favorites - dampion Note';
  })

  return (
    <div>
      <h1>dampion Note</h1>
      <p>These are my favorites</p>
    </div>   
  )
}

export default Favorites;