import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import useSWR from 'swr'

import PostCard from '../components/PostCard'
import { Sub } from '../types'

// export default function Home({ posts }) {
export default function Home() {
    const { data, error, isValidating: loading } = useSWR('/post')
    const { data: topSubs } = useSWR('/subs/top-subs')

    return (
        <>
            <Head>
                <title>readit: the front page of the internet</title>
            </Head>
            <div className='container flex pt-4'>
                {/* Posts feed */}
                <div className='w-160'>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        data?.posts?.map((post) => (
                            <PostCard post={post} key={post.identifier} />
                        ))
                    )}
                    {!loading && error && <p>Cannot retrieve posts</p>}
                </div>
                {/* Sidebar */}
                <div className='ml-6 w-80'>
                    <div className='bg-white rounded'>
                        <div className='p-4 border-b-2'>
                            <p className='text-lg font-semibold text-center'>
                                Top Communities
                            </p>
                        </div>
                        <div className=''>
                            {topSubs?.map((sub: Sub) => (
                                <div
                                    className='flex items-center px-4 py-2 text-xs border-b'
                                    key={sub.name}
                                >
                                    {/* image */}
                                    <div className='rounded-full overflow-hidden mr-2 hover:cursor-pointer'>
                                        <Link href={`/r/${sub.name}`}>
                                            <Image
                                                src={sub.imageUrl}
                                                alt={'Sub'}
                                                width={(6 * 16) / 4}
                                                height={(6 * 16) / 4}
                                            />
                                        </Link>
                                    </div>
                                    {/* link */}
                                    <Link href={`/r/${sub.name}`}>
                                        <a className='font-bold hover:cursor-pointer'>
                                            /r/${sub.name}
                                        </a>
                                    </Link>
                                    <p className='ml-auto font-med'>
                                        {sub.postCount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// server-side rendering
// export const getServerSideProps: GetServerSideProps = async context => {
//     try {
//         const { data } = await axios.get('/post')

//         return {
//             props: {
//                 posts: data.posts
//             } //will be passed to the page component as props
//         }
//     } catch (error) {
//         return {
//             redirect: {
//                 destination: '/error',
//                 permanent: false
//             }
//         }
//     }
// }
