import Link from 'next/link'
import Image from 'next/image'

import { useAuthState, useAuthDispatch } from '../context/auth'
import axios from 'axios'

const Navbar: React.FC = () => {
    const { isAuthenticated, loading } = useAuthState()
    const dispatch = useAuthDispatch()

    const logout = async () => {
        try {
            await axios.get('/auth/logout')

            dispatch('LOGOUT')

            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white'>
            {/* logo and title */}
            <div className='flex items-center'>
                <Link href='/'>
                    <a className='mr-2'>
                        <Image
                            src='/readit.svg'
                            width={28}
                            height={28}
                            className='mr-2'
                        />
                    </a>
                </Link>
                <span className='text-2xl font-semibold'>
                    <Link href='/'>readit</Link>
                </span>
            </div>
            {/* search input */}
            <div className='flex mx-auto bg-gray-100 border rounded item-center hover:border-blue-500 hover:bg-white'>
                <i className='pt-2 pl-4 pr-3 text-gray-500 fas fa-search'></i>
                <input
                    type='text'
                    className='py-1 pr-3 bg-transparent rounded focus:outline-none w-160'
                    placeholder='Search'
                />
            </div>
            {/* auth buttons */}
            {!loading &&
                (isAuthenticated ? (
                    <div className='flex'>
                        <button
                            className='w-32 py-1 mx-2 leading-5 hollow blue button'
                            onClick={() => logout()}
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <div className='flex'>
                        <Link href='/login'>
                            <a className='w-32 py-1 mx-2 leading-5 hollow blue button'>
                                Log in
                            </a>
                        </Link>
                        <Link href='/register'>
                            <a className='w-32 py-1 leading-5 blue button'>
                                Sign up
                            </a>
                        </Link>
                    </div>
                ))}
        </div>
    )
}

export default Navbar
