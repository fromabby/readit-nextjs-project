import '../styles/globals.css'
import axios from 'axios'
import { AppProps } from 'next/app'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
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
