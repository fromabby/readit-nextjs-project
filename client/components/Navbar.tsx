import Link from 'next/link'
import Image from 'next/image'

const Navbar: React.FC = () => (
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
        <div className='flex bg-gray-100 item-center mx-auto border rounded hover:border-blue-500 hover:bg-white'>
            <i className='fas fa-search text-gray-500 pl-4 pr-3 pt-2'></i>
            <input
                type='text'
                className='py-1 pr-3 rounded focus:outline-none w-160 bg-transparent'
                placeholder='Search'
            />
        </div>
        {/* auth buttons */}
        <div className='flex'>
            <Link href='/login'>
                <a className='hollow blue button py-1 leading-5 w-32 mx-2'>
                    Log in
                </a>
            </Link>
            <Link href='/register'>
                <a className='blue button py-1 leading-5 w-32'>Sign up</a>
            </Link>
        </div>
    </div>
)

export default Navbar