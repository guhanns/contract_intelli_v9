import { BrowserRouter, redirect, Route, RouterProvider, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Toaster } from 'react-hot-toast'
import 'react-circular-progressbar/dist/styles.css';
import 'react-loading-skeleton/dist/skeleton.css';
import "react-datepicker/dist/react-datepicker.css";
import router from './router'
import './i18n'

function App() {
 
  // useEffect(() => {
  //   instance
  //     .handleRedirectPromise()
  //     .then((res) => {
  //       if (res) {
  //         instance.setActiveAccount(res.account);
  //         redirect('http://shboard'); // ✅ Redirect after successful SSO
  //       } else {
  //         // Optionally attempt silent SSO
  //         instance.ssoSilent({ scopes: ['user.read'] }).then((silentRes) => {
  //           if (silentRes) {
  //             instance.setActiveAccount(silentRes.account);
  //             redirect('/dashboard'); // ✅ Already logged in, redirect to dashboard
  //           }
  //         }).catch(() => {
  //           // SSO failed, don't redirect
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Redirect error", err);
  //     });
  // }, [instance]);
  return (
    <>
   
        <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: '#363636',
              color: '#fff',
            },

            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
        <RouterProvider router={router}></RouterProvider>
        </div>
    </>
  )
}

export default App
