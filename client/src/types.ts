export interface Post {
    identifier: string
    title: string
    body?: string //optional
    slug: string
    subName: string
    createdAt: string
    updatedAt: string
    username: string
    url: string
    voteScore?: number
    commentCount?: number
    userVote?: number
}

export interface User {
    username: string
    email: string
    createdAt: string
    updatedAt: string
}

export interface Sub {
    title: string
    description: string
    name: string
    imageUrn: string
    username: string
    bannerUrn: null
    id: 8
    posts: Post[]
    createdAt: string
    updatedAt: string
    imageUrl: string
    bannerUrl: string
    postCount?: number
}
