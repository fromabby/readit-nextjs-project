import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'

export default function Register() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [agreement, setAgreement] = useState(false)
    const [errors, setErrors] = useState<any>({})

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()

        if (!agreement) {
            setErrors({ ...errors, agreement: 'You must agree to the T&Cs' })
            return
        }

        try {
            await axios.post('/auth/new', {
                email,
                password,
                username
            })

            router.push('/login')
        } catch (error) {
            setErrors(error.response.data)
        }
    }
    return (
        <div className='flex bg-white'>
            <Head>
                <title>Register</title>
            </Head>
            <div
                className='h-screen bg-center bg-cover w-36'
                style={{ backgroundImage: "url('/images/bricks.jpg')" }}
            ></div>
            <div className='flex flex-col justify-center pl-6'>
                <div className='w-70'>
                    <h1 className='mb-2 text-lg font-bold'>Sign up</h1>
                    <p className='mb-10 text-xs'>
                        By continuing, you agree to our User Agreement and
                        Privacy Policy
                    </p>
                    <form onSubmit={submitHandler}>
                        <div className='mb-6'>
                            <input
                                type='checkbox'
                                className='mr-1 cursor-pointer'
                                id='agreement'
                                checked={agreement}
                                onChange={e => setAgreement(e.target.checked)}
                            />
                            <label
                                htmlFor='agreement'
                                className='text-xs cursor-pointer'
                            >
                                I agree to get emails about cool stuff on Readit
                            </label>
                            <small className='block font-medium text-red-600'>
                                {!agreement && errors.agreement}
                            </small>
                        </div>
                        <InputGroup
                            className='mb-2'
                            value={email}
                            setValue={setEmail}
                            placeholder='Email'
                            error={errors.email}
                            type='email'
                        />

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
                            Sign Up
                        </button>
                    </form>
                    <small>
                        Already a readitor?
                        <Link href='/login'>
                            <a className='ml-1 text-blue-500 uppercase'>
                                LOG IN
                            </a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}
