import {Layout,Menu,Button,Tabs} from 'antd'
import {Card,Modal,Spin,Typography,Image,Divider,Drawer} from 'antd'
import {useState,useEffect,useContext} from 'react'
import {HomeOutlined,ShoppingCartOutlined,AppstoreOutlined,UserAddOutlined,MenuOutlined} from '@ant-design/icons'
import {contextHolder} from '../utils.js'
import LoginForm from './loginForm.jsx'
import '../styles/forms.css'
import '../styles/layout.css'
import RegisterForm from  './registerationForm.jsx'
import {Link} from 'react-router-dom'
import {globalContext} from '../App.js'


const {Header,Content,Footer} = Layout;
const {Title,Paragraph} = Typography

export default function MainLayout({children}){
	const [isLoading,setIsLoading] = useState()
    const [productDetail,setProductDetail] = useState()
    const [navVisible,setNavVisible] = useState()

    const context = useContext(globalContext)
    const SetIsModalVisible = context.SetAuthIsModalVisible
    const isModalVisible = context.isAuthModalVisible

    const showDrawer = () => {
    	setNavVisible(true)
    }
    const onClose = () => {
    	setNavVisible(false)
    }
    console.log(context.cart)

	return (
	<>
	<Layout style={{display:"block",position:"relative"}}>
		{/*{!context.confirmed && <div style={{position:"absolute",textAlign:"center",padding:"15px",backgroundColor:"skyblue",opacity:"0.5",width:"100%",top:"20",bottom:"20",marginTop:"40px"}}>Your Account is not yet confirmed and  we can't recieve your orders,Check your mail</div>}*/}
		<div className="lg-nav">
		<div className="logo" style={{color:"#325",marginRight:"30px",marginTop:"10px",fontSize:"2rem"}}>
			DigiGizmo
		</div>
		<Menu theme='light' mode='horizontal' defaultSelectedKeys={['1']} style={{width:"100%",paddingLeft:"0",paddingRight:"0"}}>
			<Menu.Item key='1' icon={<HomeOutlined />}  style={{marginLeft:"auto"}}>
				<Link to='/'>Home </Link>
			</Menu.Item>

			

			<Menu.Item key='3' icon={<AppstoreOutlined />}>
				<Link to='/products/all'>Products </Link>

			</Menu.Item>
			<Menu.Item  icon={<ShoppingCartOutlined />} style={{marginLeft:"auto",color:"blue"}}>
				<Link to='/cart'>{context.cartLength}</Link>
			</Menu.Item>

			{!localStorage.getItem("user_token") && 
			<Menu.Item  icon={<UserAddOutlined />} style={{marginLeft:"1px",color:"blue"}} onClick={() => SetIsModalVisible(true)}>
				SignUp
			</Menu.Item>
			}

			{localStorage.getItem("email") && 
			<Menu.Item  icon={<UserAddOutlined />} style={{marginLeft:"1px",color:"lightgreen"}}>
				{localStorage.getItem("email")}
			</Menu.Item>
			}
			
		</Menu>
		</div>
		<div className="sm-nav">
			<Button type='primary' onClick = {showDrawer} className="menu-btn">
				<MenuOutlined />
			</Button>
			<Typography.Paragraph style={{textAlign:"right",color:"darkblue",marginLeft:"auto",marginTop:"10px",fontSize:"1rem",fontWeight:"bolder",marginRight:"5px"}}>
				DigiGizmo
			</Typography.Paragraph>
			<Drawer title="Menu"
					placement="title"
					onClose={onClose}
					visible={navVisible}
			>
			<Menu theme='light' mode='vertical' defaultSelectedKeys={['1']} style={{width:"100%",paddingLeft:"0",paddingRight:"0"}}>
			<Menu.Item key='1' icon={<HomeOutlined />}  style={{marginLeft:"auto"}}>
						<Link to='/'>Home </Link>

			</Menu.Item>


			<Menu.Item key='3' icon={<AppstoreOutlined />}>
					<Link to='/products/all'>Products </Link>

			</Menu.Item>
			<Menu.Item  icon={<ShoppingCartOutlined />} style={{marginLeft:"auto",color:"blue"}}>
					<Link to='/cart'>{context.cartLength}</Link>

			</Menu.Item>


			{!localStorage.getItem("user_token") && 
			<Menu.Item  icon={<UserAddOutlined />} style={{marginLeft:"1px",color:"blue"}} onClick={() => SetIsModalVisible(true)}>
				SignUp
			</Menu.Item>
			}
			{localStorage.getItem("email") && 
			<Menu.Item  icon={<UserAddOutlined />} style={{marginLeft:"1px",color:"lightgreen"}} >
				{localStorage.getItem("email")}
			</Menu.Item>
			}

			
			
		</Menu>
			</Drawer>

		</div>
		
	
		<Modal 
		visible={isModalVisible} 
		onOk={() => SetIsModalVisible(false)}
		title= "Sign Up"
		onCancel={() => SetIsModalVisible(false)}
		footer = {null}
		// style={{backgroundColor:"#345"}}
		className="costum-modal"

		>
		<Tabs defaultActiveedKey='1'>
			<Tabs.TabPane tab="login" key='1'>
			<LoginForm />
			</Tabs.TabPane>

			<Tabs.TabPane  tab="signup" key='2'>
				<RegisterForm />
			</Tabs.TabPane>
		</Tabs>
		</Modal>
		<Content style={{minHeight:"100vh",marginBottom:"20px"}}>
			<div style={{marginTop:"10px"}}>
				{/*{contextHolder}*/}
				{children}
				
			</div>
		</Content>
		<Layout.Footer style={{textAlign:"center"}}>
			DigiGizmo 2024 created by Tech With Dunamix
			<div>
			<a href='/products/all'>Products </a>
			<a href='/'>Home </a>

			</div>

		</Layout.Footer>
	
	</Layout>

	</>
		)
}