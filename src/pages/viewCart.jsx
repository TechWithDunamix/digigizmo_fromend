import MainLayout from '../components/layout.jsx'
import {Row,Col,Typography,Modal,Spin,Divider,Button} from 'antd'
import CartItem from '../components/cartItem.jsx'
import {useEffect,useState,useContext} from 'react'
import {globalContext} from '../App.js'
import {BaseUrl} from '../utils.js'
import '../styles/cart.css'
import {Table} from 'antd'

const ViewCartPage = () =>{
	const context = useContext(globalContext)
	const [cartItem,setCartItem] = useState()
	const [isLoading,setIsLoading] = useState(false)
	const [isEmpty,setIsEmpty] = useState()
	const fetchCart  = () =>{
		const isAuth = localStorage.getItem("user_token")
		const options = {method:"GET",headers : {"Content-Type":"application/json",
    	'Authorization':`Token ${isAuth}`},signal:AbortSignal.timeout(150000)}
    	fetch(`${BaseUrl}/cart/`,options)
    	.then(response => {
    		if (response.ok){
    			setIsEmpty(false)
    			return response.json()
    		}else if(response.status === 401){
    			throw new Error("401")
    		}else if(response.status === 404){
    			setIsLoading(false)
    			setCartItem('Empty')
    			throw new Error("404")
    		}else{
    			throw new Error("21")
    		}

    	})
    	.then(data => {
    		setCartItem(data)
    		console.log(data)

    	})
    	.catch(error => {
    		if (error.message ==='404'){
    			setIsEmpty(true)
    		}else if(error.message === '401'){
    			context.SetAuthIsModalVisible(true)
    		}else{
    			context.message("error","Network Error")
    		}
    	})
	}
	useEffect(() =>{
		fetchCart()
	},[context.cart])

	const deleteItem = (id) => {
		setIsLoading(true)
		const isAuth = localStorage.getItem("user_token")
		const options = {method:"DELETE",headers : {"Content-Type":"application/json",
    	'Authorization':`Token ${isAuth}`},signal:AbortSignal.timeout(150000)}
		fetch(`${BaseUrl}/cart/delete/${id}`,options)
		.then(response => {
			if (response.ok){
				context.fetchCart()

				fetchCart()
				context.message("success",'Removed Item from cart')
				setIsLoading(false)

				return response.json()

			}else if(response.status === 404){
				setIsLoading(false)
				context.message("error","Error : Not Found .")
			}else if(response.status === 401){
				setIsLoading(false)
				context.message("error","You are not signed in .")
			}else{
				setIsLoading(false)
				context.message("error","Network Error")
			}
		})
		.then(data => {
			console.log(data)
		})

		


		
	}
	const handleOrder = () =>{
		const isAuth = localStorage.getItem("user_token")
		const options = {method:"POST",headers : {"Content-Type":"application/json",
    	'Authorization':`Token ${isAuth}`},signal:AbortSignal.timeout(150000)}
		fetch(`${BaseUrl}/order`,options)

		.then(response => {
			if (response.ok){
				context.message("success",'Your Order is placed')
				setTimeout(() => {
					window.location.href = 'https://wa.me/08119730652'
				},1000)
			}
		})
		.then(data => {
			console.log(data)
		})
		.catch(error => {
			context.message("error",error.message)
		})

	}
	const columns = [
	
	{
		title: 'Product',
		dataIndex:["product"],
		key:"product", 
		responsive:['xs','sm','md','lg'],
		render:(data) => <>
		<img src={data.image} style={{width:60,maxHeight:'100px',position:"relative"}} />
		<Button style={{position:"absolute",color:"red"}} size="small" onClick = {() => deleteItem(data.id)}>X</Button>
		<p>{data.name}</p>
		</>
	},
	{
		title: 'Price',
		dataIndex:["product","price"],
		key:"price", 
		responsive:['lg'],
		render:(data) => <>
	
		<p>{data}</p>
		</>
	},
	{
		title: 'Quantity',
		dataIndex:"quantity",
		key:"quantity", 
		responsive:['xs','sm','md','lg'],
		render:(data) => <Typography.Paragraph>{data}</Typography.Paragraph>
	},
		{
		title: 'Sub Total',
		dataIndex:"total_price",
		key:"sub_total", 
		responsive:['xs','sm','md','lg'],
		render:(data) => <Typography.Paragraph>{data}</Typography.Paragraph>
	},
	]
	if (!cartItem){
		return <MainLayout>
			<Spin />
		</MainLayout>
	}
	if (isEmpty){
		return <MainLayout>
			<Row>
				<Col xs={24} md={24} lg={18} sm={24} className="cartList">
				<div style={{padding:"25px",border:"0.6px solid #999",borderRadius:"10px"}}>
					<div style={{border:"2px solid green",borderRadius:"20px"}}>
					</div>
				</div>
					
				<h1>Empty Cart</h1>

				</Col>
			</Row>
		</MainLayout>
	}

	return (
		<MainLayout>
			<Row style={{marginTop:"50px"}}>
				<Col xs={24} md={24} lg={12} sm={24} className="cartList">
				<div style={{padding:"25px",border:"0.6px solid #999",borderRadius:"10px"}}>
					<div style={{border:"2px solid green",borderRadius:"20px"}}>
					</div>
				</div>
				{!isEmpty ? 
					<Table  dataSource={cartItem.cart_items} columns={columns} />:
					<h1>Empty Cart</h1>

				}
				</Col>
				<Col xs={24} md={24} sm={24} lg={9}>
					<Typography.Title>Cart Summary </Typography.Title>

					<Divider />
					< Typography.Paragraph><b>Quantity :</b> {cartItem.cart_items.length} </Typography.Paragraph>
					<Divider />
					< Typography.Paragraph><b>Total :</b>$ {cartItem.total_price} </Typography.Paragraph>
					<Divider />
					<Button style={{color:"white",backgroundColor:"black"}} onClick={handleOrder}>Checkout  </Button>
				</Col>
			</Row>
		</MainLayout>

		)
}
export default ViewCartPage