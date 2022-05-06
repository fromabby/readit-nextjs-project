import axios from 'axios'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'

import '../styles/tailwind.css'
import '../styles/icons.css'

import { AuthProvider } from '../context/auth'

import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true

function MyApp({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter()
    const authRoutes = ['/register', '/login']
    const authRoute = authRoutes.includes(pathname)

    const fetcher = async (url: string) => {
        try {
            const { data } = await axios.get(url)

            return data
        } catch (error) {
            throw error.response.data
        }
    }
    return (
        <SWRConfig
            value={{
                fetcher,
                dedupingInterval: 10000,
            }}
        >
            <AuthProvider>
                {!authRoute && <Navbar />}
                <div className={authRoute ? '' : 'pt-12'}>
                    <Component {...pageProps} />
                </div>
            </AuthProvider>
        </SWRConfig>
    )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
