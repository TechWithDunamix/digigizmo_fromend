import {Form,Input,Button,Typography} from 'antd'
import {Spin} from 'antd'

import {useState,useEffect,useContext} from 'react'
import {globalContext} from '../App.js'
import {BaseUrl} from '../utils.js'
const LoginForm = () => {
    const context = useContext(globalContext)
 	const SetIsModalVisible = context.SetAuthIsModalVisible
    const isModalVisible = context.isAuthModalVisible
    const [isLoading,setIsLoading] = useState(false)
    const [form] = Form.useForm()
    const [error,setErrors] = useState()
	const handleSubmit = (values) =>{
		setIsLoading(true)
		console.log(values)
		const body = JSON.stringify(values)
		const options = {method:"POST",body:body,headers : {"Content-Type":"application/json"},signal:AbortSignal.timeout(150000)}
		fetch(`${BaseUrl}/auth/login`,options)
		.then(response => {
			if (response.ok){
				context.fetchCart()
				return response.json()
				
			}
			if (response.status === 400){
				form.setFields([
					{	name:"email"},
						{errors:['Invalid User Credentials']
					}
					])
				console.log("error")
				context.message("error","Invalid User Credentials")
				setIsLoading(false)
				setErrors(true)
				throw new Error("400")

				
				
			}
		})
		.then(data => {
			console.log(data)
			
			SetIsModalVisible(false)
			localStorage.setItem("user_token",data.token)
			localStorage.setItem("email",data.email)
			localStorage.setItem("confirmed",data.confirmed)



		})
		.catch(error => {
			
			context.message('error',error.message)
			
		})
		

	}
	return (

	<Form form ={form} name='login' style={{marginTop:"20px",paddingTop:"10px",paddingLeft:"30px",paddingRight:"30px"}} onFinish={handleSubmit}>
	<Typography.Title>DigiGizmo </Typography.Title>

	<Form.Item name="email" rules={[{required:"true",message:"Plaease input your Email"}]}>
		<Input placeholder="Email" />

	</Form.Item>

	<Form.Item name="password" rules={[{required:"true",message:"Plaease input your password"}]} style={{marginTop:"40px"}}>
		<Input.Password placeholder="Password" />

	</Form.Item>
	<Form.Item>
		<Button  type="primary" htmlType='submit' style={{width:"50%"}}>
			Login
		</Button>
		{error && <p style={{color:"red"}}>Invalid credentials</p>}

	</Form.Item>
	{isLoading && <Spin tip="Loging in"/>}
	</Form>

		)
}
export default LoginForm