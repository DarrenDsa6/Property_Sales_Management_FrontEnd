import React from 'react'
import Navigationbar from '../CommonComponents/Navigationbar'
import Login from './Login'
import Footer from '../CommonComponents/Footer'
export default function LoginPage() {
  return (
    <>
    <Navigationbar/>
    <div className='mt-4'>
    <Login/>
    </div>
    <Footer/>
    </>
    
  )
};
