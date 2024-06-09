import {Card,Button,Modal,Spin,Typography,Image,Divider} from 'antd'
import {ShoppingCartOutlined,HeartOutlined} from '@ant-design/icons'
import '../styles/homepage.css'
import {AddtoCart} from '../utils.js'
import {useContext} from 'react'
import {useState} from 'react'
import {globalContext} from '../App.js'
import {BaseUrl} from '../utils.js'
const {Meta} = Card
const {Title,Paragraph} = Typography
function ProductCard({product}){
	const [isModalVisible,SetIsModalVisible] = useState(false)
	const [isLoading,setIsLoading] = useState()
	const [isLoadingCart,setIsLoadingCart] = useState()

	const [productDetail,setProductDetail] = useState({})
    const context = useContext(globalContext)

	const showModal = (id) => {
		console.log(id)
		setIsLoading(true)
		SetIsModalVisible(true)
		fetch(`${BaseUrl}/products/${id}`)
		.then(response => {
			if (response.status == 404){
				throw new Error("404")
			}
			if (response.ok){
				return response.json()
				

			}
		})
		.then(data => {
			setIsLoading(false)
			setProductDetail(data)
		})
		.catch(error =>{
			console.log(error)
			// alert(error)
		})

			}
	
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
	return (<div className="trending-product-card-container"><Card
		onClick={() => showModal(product.id)} 
		hoverable 
		className = 'trending-product-card'
		cover={<img alt={product.name}src={product.image} className="trending-product-image"/>}
		
		>
		

		<Meta title={product.name} description={`$${product.price}`} />

		{context.cart ? (!context.cart.find(item => {return item.product.id === product.id}) ?
				<div style={{display:"flex",justifyContent:"space-between",marginTop:"20px"}}>
					<Button icon={isLoadingCart ? <Spin /> :<ShoppingCartOutlined/>} key="cart" onClick={() => AddtoCart(product.id)}/>
					<Button icon={<HeartOutlined/>} key="wishlist" />
				</div>: <p style={{color:"red"}}>Already in Cart </p>):
				<div style={{display:"flex",justifyContent:"space-between",marginTop:"20px"}}>
					<Button icon={isLoadingCart ? <Spin /> :<ShoppingCartOutlined/>} key="cart" onClick={() => AddtoCart(product.id)}/>
					<Button icon={<HeartOutlined/>} key="wishlist" />
				</div>}

	</Card>
	<Modal 
	visible={isModalVisible} 
	onOk={() => SetIsModalVisible()}
	title= {productDetail.name ? productDetail.name : "Product Detail"}
	onCancel={() => SetIsModalVisible(false)}
	footer = {[
			<Button icon={<ShoppingCartOutlined/>} key="cart"/>,
			<Button icon={<HeartOutlined/>} key="wishlist" />

		]}
	>
	{isLoading ? (<Spin />):

	(productDetail && (
		<>
		<Image src={productDetail.image} />
		<Divider/>
		<Paragraph style={{color:"gray"}}>
		{productDetail.description}
		</Paragraph>
		</>	



		) )
	}
	</Modal>
	</div>)

}
const TrendingProductList = ({products}) =>{

	if (!products){
		return <Spin />
	}
	
	return (<div className="trending-product-container">
		
		{products.results.slice(0,10).map((product,index) => {
			return <>
			
			<ProductCard product={product} key={index}/>

			</>
		})}
		
		</div>)
	console.log(products)

		
}
export default TrendingProductList