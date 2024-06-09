import {Card,Button,Modal,Spin,Typography,Image,Divider} from 'antd'
import {ShoppingCartOutlined,HeartOutlined} from '@ant-design/icons'
import {useContext} from 'react'
import {useState} from 'react'
import {globalContext} from '../App.js'
import {BaseUrl} from '../utils.js'
import '../styles/products.css'
const {Meta} = Card
const ProductCard = ({product}) => {
	const [isLoadingCart,setIsLoadingCart] = useState()
	const context = useContext(globalContext)
	 function AddtoCart(id){
	  		setIsLoadingCart(true)
			const isAuth = localStorage.getItem("user_token")
			const options = {method:"POST",headers : {"Content-Type":"application/json",
			'Authorization':`Token ${isAuth}`},signal:AbortSignal.timeout(150000)}

			fetch(`${BaseUrl}/cart/add/${id}`,options)
			.then(response => {
			if (response.ok){
			    context.message("success","Added to cart successfully")
			    context.fetchCart()
	  			setIsLoadingCart(false)

			    return response.json()
			}
			if (response.status === 401){
			    context.message("info",'Ooops you are not authenticated')
			    context.SetAuthIsModalVisible(true)
	  			setIsLoadingCart(false)

			    
			}
			if (response.status === 404){
			    context.message("info","Ooops 404 error")
	  			setIsLoadingCart(false)

			}
			})
			.then(data => {
				console.log(data)
			})
			.catch(error =>{
				context.message("error","Network Time Out")
				console.log(error)
	  			setIsLoadingCart(false)

			})
	}
	const handleDetail = (id) =>{
		window.location.href = `/product/${id}`
	}
	return <Card 
			hoverable
			className="productCard"
			cover={<img alt={product.name} src={product.image} className="productImage" />}
			onClick={() => handleDetail(product.id)}
	        >
	        <p className="productCategory">{product.category_name}</p>
			<Meta title={product.name} description={`$${product.price}`} className="productTexts"/>
			{context.cart ? (!context.cart.find(item => {return item.product.id === product.id}) ? 
			<div style={{display:"flex",justifyContent:"space-between",marginTop:"20px"}}>
				<Button icon={isLoadingCart ? <Spin /> :<ShoppingCartOutlined/>} key="cart"  onClick={(e) => AddtoCart(product.id)}/>
				<Button icon={<HeartOutlined/>} key="wishlist" />
			</div>
			: <p style={{color:"red"}}>Already in Cart </p>):
			<div style={{display:"flex",justifyContent:"space-between",marginTop:"20px"}}>
				<Button icon={isLoadingCart ? <Spin /> :<ShoppingCartOutlined/>} key="cart"  onClick={(e) => AddtoCart(product.id)}/>
				<Button icon={<HeartOutlined/>} key="wishlist" />
			</div>}
			</Card>
}
export default ProductCard