import MainLayout from  '../components/layout.jsx'
import {useEffect,useState,useContext} from 'react'
import {globalContext} from '../App.js'
import {BaseUrl} from '../utils.js'
import {Spin,Row,Col,Typography,Pagination} from 'antd'
import ProductCard from '../components/productCard.jsx'
const ProductPage = () => {
	const context = useContext(globalContext)
	const [products,setProducts] = useState(null)
	const [pagination,setPagination] = useState({
		current:1,pageSize:24,total:0
	})

	const fetchProduct = (page) =>{
		const options = {method:"GET",headers : {"Content-Type":"application/json",
    	'Authorization':`Token ${localStorage.getItem("user_token")}`},signal:AbortSignal.timeout(150000)}
		fetch(`${BaseUrl}/products/all?page=${page}`,options)
		.then(response => {
			if (response.ok){
				return response.json()
			}
		})
		.then(data => {
			setProducts(data)
			console.log(data)
			setPagination({current:page,pageSize:24,total:data.count})
		})

		.catch(error =>{
			context.message('info',error.message)
		})
	}
	const handlePageChange =(page) =>{
		fetchProduct(page)
	}
	useEffect(() => {
		fetchProduct(1)
	},[]);
	if (!products){
		return <MainLayout>
			<div style={{marginLeft:"50px"}}>
				<Spin />
			</div>
		</MainLayout>
	}
	
	return <MainLayout>	
			<Row justify ='center'>
				{products.results.map(product => {
					return <Col xs={12} lg={4} md={8} sm={12}>
						<ProductCard product={product} />
					</Col>	
				})}
			</Row>
			<Pagination 
			current={pagination.current}
			total={pagination.total}
			pageSize={pagination.pageSize}
			onChange={handlePageChange}
			style={{textAlign:"center",marginTop:"20px"}} 
			/>
		</MainLayout>	
	}

export default ProductPage