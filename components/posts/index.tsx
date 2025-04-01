import React, { useState } from 'react'
import PostCreator from "./postCreater"
import PostList from "./postList"

const PostTweet = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="p-4">
      <PostCreator onPostCreated={handlePostCreated} />
      <PostList key={refreshKey} />
    </div>
  )
}

export default PostTweet
