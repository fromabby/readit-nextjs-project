import axios from 'axios'
import { AppProps } from 'next/app'
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
    return (
        <AuthProvider>
            {!authRoute && <Navbar />}
            <Component {...pageProps} />
        </AuthProvider>
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
