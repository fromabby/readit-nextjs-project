import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'

export default function Register() {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<any>({})

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('/auth/login', {
                username,
                password
            })

            router.push('/')
        } catch (error) {
            setErrors(error.response.data)
            console.log(error)
        }
    }
    return (
        <div className='flex'>
            <Head>
                <title>Login</title>
            </Head>
            <div
                className='h-screen bg-center bg-cover w-36'
                style={{ backgroundImage: "url('/images/bricks.jpg')" }}
            ></div>
            <div className='flex flex-col justify-center pl-6'>
                <div className='w-70'>
                    <h1 className='mb-2 text-lg font-bold'>Login</h1>
                    <form onSubmit={submitHandler}>
                        <InputGroup
                            className='mb-2'
                            value={username}
                            setValue={setUsername}
                            placeholder='Username'
                            error={errors.username}
                            type='text'
                        />
                        <InputGroup
                            className='mb-4'
                            value={password}
                            setValue={setPassword}
                            placeholder='Password'
                            error={errors.password}
                            type='password'
                        />
                        <button className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded'>
                            Login
                        </button>
                    </form>
                    <small>
                        New to Readit?
                        <Link href='/register'>
                            <a className='ml-1 text-blue-500 uppercase'>
                                SIGN UP
                            </a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}