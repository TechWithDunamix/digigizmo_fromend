import MainLayout from '../components/layout.jsx'
import {useParams} from 'react-router-dom'
import {useEffect,useState,useContext} from 'react'
import {Spin,Row,Col,Typography,Button} from 'antd'
import {BaseUrl} from '../utils.js'
import {globalContext} from '../App.js'
import '../styles/products.css'
const ProductDetailPage = () =>{
	const {id} = useParams()
	const [productDetail,setProductDetail] = useState()
	const [isDisabled,setisDisabled] = useState()
	const [isLoadingCart,setIsLoadingCart] = useState(false)
	const context = useContext(globalContext)
	const fetchData = () =>{
		const options = {method:"GET",headers : {"Content-Type":"application/json",
    	'Authorization':`Token ${localStorage.getItem("user_token")}`},signal:AbortSignal.timeout(150000)}

		fetch(`${BaseUrl}/products/${id}`,options)
		.then(response => {
			if (response.ok){
				return response.json()
			}
		})
		.then(data => {
			setProductDetail(data)
		})
		.catch(error => {
			console.log(error)
		})
	}
	useEffect(() =>{
		fetchData()
		const inCart = context.cart.some(item => item.product.id === productDetail.id)
		console.log(inCart)
		setisDisabled(inCart)
	},[id,context.cart])
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
	  			// setIsLoadingCart(false)

			})
	}
	if (!productDetail){
		return 
		<MainLayout>
			<Spin />
		</MainLayout>
	}
	return <MainLayout>
		<div className="product-detail-container">
			<Row>
				<Col xs={24} sm={24} lg={12} md={24}>
					<img className="product-detail-image" src={productDetail.image} alt={productDetail.name} />
				</Col>
				<Col xs={24} sm={24} lg={12} md={24} className="product-detail-text-container">
					<Typography.Title>{productDetail.name}</Typography.Title>
					<Typography.Paragraph>{productDetail.description}</Typography.Paragraph>
					<Typography.Paragraph>${productDetail.price}</Typography.Paragraph>

					<Button onClick={() => AddtoCart(productDetail.id)} type='primary' disabled={isDisabled} className="product-detail-btn">Add to cart </Button>
					{isDisabled && <p style={{color:"red"}}>{isLoadingCart ? <Spin /> : 'Already in cart' }</p>}

				</Col>

			</Row>
		</div>
	</MainLayout>
}

export default ProductDetailPage