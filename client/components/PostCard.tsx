import Link from 'next/link'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
interface PostCardProps {
    post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <div key={post.identifier} className='flex mb-4 bg-white rounded'>
            {/* Vote section */}
            <div className='w-10 text-center bg-gray-200 rounded-l'>
                <p>V</p>
            </div>
            {/* Post data section */}
            <div className='w-full p-2'>
                <div className='flex items-center'>
                    <Link href={`/r/${post.subName}`}>
                        <>
                            <img
                                src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                                className='w-6 h-6 mr-1 rounded-full cursor-pointer'
                            />
                            <a className='text-xs font-bold hover:underline cursor-pointer'>
                                /r/{post.subName}
                            </a>
                        </>
                    </Link>
                    <p className='text-xs text-gray-500'>
                        <span className='mx-1'>•</span>
                        Posted by
                        <Link href={`/u/${post.username}`}>
                            <a className='mx-1 hover:underline'>
                                /u/{post.username}
                            </a>
                        </Link>
                        <Link href={post.url}>
                            <a className='mx-1 hover:underline'>
                                {dayjs(post.createdAt).fromNow()}
                            </a>
                        </Link>
                    </p>
                </div>
                <Link href={post.url}>
                    <a className='my-1 text-lg font-medium'>{post.title}</a>
                </Link>
                {post.body && <p className='my-1 text-sm'>{post.body}</p>}
                {/* action buttons */}
                <div className='flex'>
                    <Link href={post.url}>
                        <a>
                            <div className='text-gray-400 py-1 px-1 mr-1 rounded cursor-pointer hover:bg-gray-200 text-xs'>
                                <i className='fas fa-comment-alt fa-xs mr-1'></i>
                                <span className='font-bold'>20 comments</span>
                            </div>
                        </a>
                    </Link>
                    <div className='text-gray-400 py-1 px-1 mr-1 rounded cursor-pointer hover:bg-gray-200 text-xs'>
                        <i className='fas fa-share fa-xs mr-1'></i>
                        <span className='font-bold'>Share</span>
                    </div>
                    <div className='text-gray-400 py-1 px-1 mr-1 rounded cursor-pointer hover:bg-gray-200 text-xs'>
                        <i className='fas fa-bookmark fa-xs mr-1'></i>
                        <span className='font-bold'>Save</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard