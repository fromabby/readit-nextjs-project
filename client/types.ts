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