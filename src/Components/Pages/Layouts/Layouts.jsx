import React from 'react'
import Topbar from '../Topbar/Topbar'
import Sidebar from '../Sidebar/Sidebar'
import './layout.css'
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs'

function Layouts({children}) {
  return (
   <>
    <main className='main-container'>
        <Sidebar/>
        <Topbar/>
        
        <section className='main-section'>
            {children}
        </section>
    </main>
   </>
  )
}

export default Layouts