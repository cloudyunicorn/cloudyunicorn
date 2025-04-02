import React, { useState } from 'react'
import PostCreator from "./postCreater"
import PostList from "./postList"
import { useData } from '@/context/DataContext'

const PostTweet = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const { refreshData } = useData()

  const handlePostCreated = async () => {
    await refreshData()
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
