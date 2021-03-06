import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Post } from '../../../../types'
import Sidebar from '../../../../components/Sidebar'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from 'classnames'
import { useAuthState } from '../../../../context/auth'
import ActionButton from '../../../../components/ActionButton'

dayjs.extend(relativeTime)

export default function PostPage() {
    const router = useRouter()
    const { isAuthenticated } = useAuthState()

    const { identifier, sub, slug } = router.query

    const { data: post, error } = useSWR<Post>(
        identifier && slug ? `/post/${identifier}/${slug}` : null
    )

    if (error) {
        router.push('/')
    }

    const vote = async (value: number) => {
        if (!isAuthenticated) router.push('/login')

        if (value === post.userVote) value = 0

        try {
            const res = await axios.post('/vote/new', {
                value,
                identifier,
                slug,
            })

            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Head>
                <title>{post?.title}</title>
            </Head>
            {/* banner */}
            <Link href={`/r/${sub}`}>
                <a>
                    <div className='flex items-center w-full h-20 p-8 bg-blue-500'>
                        <div className='container flex'>
                            {/* image */}
                            {post && (
                                <div className='rounded-full w-8 h-8 overflow-hidden mr-2'>
                                    <Image
                                        src={post.sub.imageUrl}
                                        height={(8 * 16) / 4}
                                        width={(8 * 16) / 4}
                                    />
                                </div>
                            )}
                            <p className='text-xl font-semibold text-white'>
                                /r/{sub}
                            </p>
                        </div>
                    </div>
                </a>
            </Link>
            <div className='container flex pt-5'>
                {/* Post */}
                <div className='w-160'>
                    <div className='bg-white rounded'>
                        {post && (
                            <div className='flex'>
                                {/* Vote section */}
                                <div className='w-10 py-3 text-center rounded-l'>
                                    {/* Upvote */}
                                    <div
                                        className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
                                        onClick={() => vote(1)}
                                    >
                                        <i
                                            className={classNames(
                                                'icon-arrow-up',
                                                {
                                                    'text-red-500':
                                                        post.userVote === 1,
                                                }
                                            )}
                                        ></i>
                                    </div>
                                    {/* Comment count */}
                                    <p className='text-xs font-bold'>
                                        {post.voteScore}
                                    </p>
                                    {/* Downvote */}
                                    <div
                                        className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600'
                                        onClick={() => vote(-1)}
                                    >
                                        <i
                                            className={classNames(
                                                'icon-arrow-down',
                                                {
                                                    'text-blue-600':
                                                        post.userVote === -1,
                                                }
                                            )}
                                        ></i>
                                    </div>
                                </div>
                                {/* Post details */}
                                <div className='p-2'>
                                    <div className='flex items-center'>
                                        <p className='text-xs text-gray-500'>
                                            Posted by
                                            <Link href={`/u/${post.username}`}>
                                                <a className='mx-1 hover:underline'>
                                                    /u/{post.username}
                                                </a>
                                            </Link>
                                            <Link href={post.url}>
                                                <a className='mx-1 hover:underline'>
                                                    {dayjs(
                                                        post.createdAt
                                                    ).fromNow()}
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                    {/* Post title */}
                                    <h1 className='my-1 text-xl font-medium'>
                                        {post.title}
                                    </h1>
                                    {/* Post body */}
                                    <p className='my-3 text-sm'>{post.body}</p>
                                    {/* Action buttons */}
                                    <div className='flex'>
                                        <Link href={post.url}>
                                            <a>
                                                <ActionButton>
                                                    <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                                                    <span className='font-bold'>
                                                        {post.commentCount
                                                            ? post.commentCount
                                                            : 0}{' '}
                                                        comments
                                                    </span>
                                                </ActionButton>
                                            </a>
                                        </Link>
                                        <ActionButton>
                                            <i className='mr-1 fas fa-share fa-xs'></i>
                                            <span className='font-bold'>
                                                Share
                                            </span>
                                        </ActionButton>
                                        <ActionButton>
                                            <i className='mr-1 fas fa-bookmark fa-xs'></i>
                                            <span className='font-bold'>
                                                Save
                                            </span>
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                {post && <Sidebar sub={post.sub} />}
            </div>
        </>
    )
}
