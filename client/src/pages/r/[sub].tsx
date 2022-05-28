import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import React, { createRef, useState, useEffect, ChangeEvent } from 'react'
import useSWR from 'swr'
import PostCard from '../../components/PostCard'
import { Sub } from '../../types'
import { useAuthState } from '../../context/auth'
import classNames from 'classnames'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

export default function SubPage() {
    // Local state
    const [ownSub, setOwnSub] = useState(false)
    // Global state
    const { isAuthenticated, user } = useAuthState()
    // Utils
    const fileInputRef = createRef<HTMLInputElement>()
    const router = useRouter()

    const subName = router.query.sub

    const {
        data: sub,
        error,
        isValidating: loading,
        mutate,
    } = useSWR<Sub>(subName ? `/subs/${subName}` : null)

    if (error) {
        router.push('/')
    }

    let postsMarkup

    if (!sub) {
        postsMarkup = <p className='text-lg text-center'>Loading...</p>
    } else if (sub.posts.length === 0) {
        postsMarkup = (
            <p className='text-lg text-center'>No posts submitted yet</p>
        )
    } else {
        postsMarkup = sub.posts.map((post) => (
            <PostCard key={post.identifier} post={post} />
        ))
    }

    useEffect(() => {
        if (!sub) return

        setOwnSub(isAuthenticated && user.username === sub.username)
    }, [sub])

    const openFileInput = (type: string) => {
        if (!ownSub) return

        fileInputRef.current.name = type
        fileInputRef.current.click()
    }

    const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]

        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', fileInputRef.current.name)

        try {
            await axios.put<Sub>(`/subs/${sub.name}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            mutate(sub, true) // revalidate()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div>
                <Head>
                    <title>{sub?.title}</title>
                </Head>
            </div>
            {sub && (
                <>
                    <input
                        type='file'
                        hidden={true}
                        ref={fileInputRef}
                        onChange={uploadImage}
                    />
                    {/* Sub info and images */}
                    <div>
                        {/* Banner image */}
                        <div
                            className={classNames('bg-blue-500', {
                                'cursor-pointer': ownSub,
                            })}
                            onClick={() => openFileInput('banner')}
                        >
                            {sub.bannerUrl ? (
                                <div
                                    className='h-56 bg-blue-500'
                                    style={{
                                        backgroundImage: `url(${sub.bannerUrl})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                            ) : (
                                <div className='h-20 bg-blue-500'></div>
                            )}
                        </div>
                        {/* Sub metadata */}
                        <div className='h-20 bg-white'>
                            <div className='container relative flex'>
                                <div className='absolute' style={{ top: -15 }}>
                                    <Image
                                        src={sub.imageUrl}
                                        alt='Sub'
                                        className={classNames('rounded-full', {
                                            'cursor-pointer': ownSub,
                                        })}
                                        width={70}
                                        height={70}
                                        style={{
                                            backgroundColor: 'white',
                                            border: '2px solid white',
                                        }}
                                        onClick={() => openFileInput('image')}
                                    />
                                </div>
                                <div className='pt-1 pl-24'>
                                    <div className='flex items-center'>
                                        <h1 className='mb-1 text-3xl font-bold'>
                                            {sub.title}
                                        </h1>
                                    </div>
                                    <p className='text-sm font-bold text-gray-500'>
                                        /r/{sub.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Posts & Sidebar */}
                    <div className='container flex pt-5'>
                        <div className='w-160'>{postsMarkup}</div>
                        <Sidebar sub={sub} />
                    </div>
                </>
            )}
        </>
    )
}
