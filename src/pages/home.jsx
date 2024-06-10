import MainLayout from '../components/layout.jsx'
import {Row,Col,Button,Typography,Carousel,Spin} from 'antd'
import '../styles/homepage.css'
import TrendingProductList from '../components/trending-products-list.jsx'
import {useEffect} from 'react'
import {useContext} from 'react'
import {useState} from 'react'
import {globalContext} from '../App.js'
import {BaseUrl} from '../utils.js'
import Image1 from '../images/homepage1.png'
import Image2 from '../images/homepage2.png'
import ProductCard from '../components/productCard.jsx'
import {Link} from  'react-router-dom'
const {Title,Paragraph} = Typography
export default function HomePage(){
	const context = useContext(globalContext)
	const [productList,setProductList] = useState(null)
	const fetchData = () => {
		fetch(`${BaseUrl}/products/all`)
		.then(response => {
			console.log(response)
			return response.json()
		})
		.then(data => {
			setProductList(data)
			
		})
	}
	useEffect(() => {
		fetchData()
	},[context.cart])

	return (
	<MainLayout>
		
		<div className = 'hero-container'>
			<Row justify="center" align="middle">
				<Col xs={24} sm={20} md={16} lg={12}>
					<div className="hero-content">
						<Paragraph className="hero-small-title">
						Discover The Latest Gadgets
						</Paragraph>
						<Title className="hero-title" style={{color:"white"}}>
						DigiGizmo
						</Title>
						<Paragraph className="hero-subtitle" style={{color:"floralwhite"}}>
						from cutting-edge smartphones to smart home devices,
						find everything you need tp stay ahead on the tech curve
						</Paragraph>
						<Button type="primary"className="hero-button" size="large">
						<Link to='/products/all'> Shop Now</Link>
						</Button>
					</div>
				</Col>
			</Row>
		</div>
		<Title style={{color:"gray",marginLeft:"20px"}} id="trending-product-heading">
			Trending Products
		</Title>

		<TrendingProductList products={productList} />

		<Row>
		<Col xs={0} lg={8} md={0}>
			<img src={Image1}  style={{maxWidth:'100%',hight:"auto"}}/>
		</Col>

		<Col xs={24}lg={8} md={24}>
			<div class="quality-product-container">
			<div class="quality-product-heading">
				<h1>High quality Electronics and Gadget from quality and reliable suppliers</h1>

				
			</div>
			<p class="quality-product-detail">
					Find unique electronics to dropship from 
					reliable suppliers in Anambra,Enugu,Ebonyi and globally
			</p>
			</div>
		</Col>

		<Col xs={0} lg={8} md={0}>
			<img src={Image2} style={{maxWidth:'100%',hight:"auto"}}/>
			
		</Col>
		</Row>

		<Row justify='center'>
		{productList && productList.results.slice(1,24).map(product => {
						return <Col xs={12} lg={4} md={8} sm={12}>
							<ProductCard product={product} />
						</Col>	
					})}

		</Row>

		
	</MainLayout>


		)
}