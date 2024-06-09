import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import HomePage from './pages/home.jsx'
import ProductPage from './pages/products.jsx'
import ProductDetailPage from './pages/productDetailPage.jsx'
import React from 'react'
import {message} from 'antd'
import {useState,useEffect} from 'react'
import {BaseUrl} from './utils.js'
import ViewCartPage from './pages/viewCart.jsx'
import {Result,Button} from 'antd'
export const globalContext = React.createContext(null)
function NotFoundPage(){
  return <Result
      status='404'
      title='404'
      subTitle='Sorry, The page you requested does not exists'
      extra = {<Button><Link to='/'>Back to Home </Link></Button>}
  />
}
function App() {
  const [messageApi,contextHolder] = message.useMessage();
  const [isModalVisible,SetIsModalVisible] = useState(false)
  const [cart,setCart] = useState([])
  const [cartLength,setCartLength] = useState(0)
  const [confirmed,setConfirmed] = useState()
  const Message = (type,message = "") => {
    messageApi.open({
      type:type,
      content:message
    })
  }
  const isAuth = localStorage.getItem("user_token")

  const fetchCart = () =>{

    const options = {method:"GET",headers : {"Content-Type":"application/json",
    'Authorization':`Token ${isAuth}`},signal:AbortSignal.timeout(150000)}

    fetch(`${BaseUrl}/cart/`,options)
    .then(response => {
      if (response.ok){
        return response.json()
      }
      if (response.status === 401){
        if (!localStorage.getItem("user_token")){
        Message("error","Pls Sign up")
        throw new Error("401")}

      }
      if (response.status === 404){
        setCart([])
        setCartLength(0)
        Message("info","Your Cart Is Empty")
        throw new Error("404")
        
      }
    })
    .then(data => {
      setCart(data.cart_items)
      setCartLength(data.cart_items.length)
      setConfirmed(data.confirmed)
    })
    .catch(error =>{
      Message("error",'Network Error')
      console.log(error)
    })
  }
  useEffect(()=>{
    if (isAuth){
      fetchCart()
      
    }
    },[])
   
  const data = {"message":Message,
              'isAuthModalVisible':isModalVisible,
              'SetAuthIsModalVisible':SetIsModalVisible,
              'fetchCart':fetchCart,
              'cart':cart,
              'cartLength':cartLength,
              'confirmed':confirmed

              
              }
  return (

    <div>
    {contextHolder}
    <globalContext.Provider value={data}>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
           <Route path='products/all' element={<ProductPage />} />
           <Route path='product/:id' element={<ProductDetailPage />} />
           <Route path='*' element={<NotFoundPage />} />

           <Route path='cart' element={<ViewCartPage />} />

        </Routes>
      </BrowserRouter>
     </globalContext.Provider>
    </div>
   
    
  );
}

export default App;
