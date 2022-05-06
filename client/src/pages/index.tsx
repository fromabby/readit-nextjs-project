import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import useSWR from 'swr'

import { Post } from '../types'

import PostCard from '../components/PostCard'

// export default function Home({ posts }) {
export default function Home() {
    const { data, error, isValidating: loading } = useSWR('/post')

    // client-side rendering

    // const [posts, setPosts] = useState<Post[]>([])
    // const [loading, setLoading] = useState(true)
    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             const { data } = await axios.get('/post')

    //             setPosts(data.posts)
    //             setLoading(false)
    //         } catch (error) {
    //             console.log(error.response.data)
    //             setLoading(false)
    //         }
    //     }

    //     fetchPosts()
    // }, [])

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
