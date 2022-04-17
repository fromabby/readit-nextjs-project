import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import { Post } from '../types'

import PostCard from '../components/PostCard' 

// export default function Home({ posts }) {
export default function Home() {
    // client-side rendering
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get('/post')

                setPosts(data.posts)
                setLoading(false)
            } catch (error) {
                console.log(error.response.data.message)
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    return (
        <div className='pt-12'>
            <Head>
                <title>readit: the front page of the internet</title>
            </Head>
            <div className='container flex pt-4'>
                {/* Posts feed */}
                <div className='w-160'>
                    {!loading && posts && posts.map(post => (
                        <PostCard post={post} key={post.identifier}/>
                    ))}
                </div>
                {/* Sidebar */}
            </div>
        </div>
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
