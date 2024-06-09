import {Form,Input,Button,Typography} from 'antd'
import {Spin} from 'antd'

import {useState,useEffect,useContext} from 'react'
import {globalContext} from '../App.js'
import {BaseUrl} from '../utils.js'
const RegisterForm = () => {
    const [form] = Form.useForm()
    const context = useContext(globalContext)
 	const SetIsModalVisible = context.SetAuthIsModalVisible
    const isModalVisible = context.isAuthModalVisible
    const [isLoading,setIsLoading] = useState(false)
    const validatePassword = (rule,value) =>{
    	if (value && value !== form.getFieldValue("password")){
    		return Promise.reject("Passwor does not match")
    	}
    	return Promise.resolve()
    }
    const [error,setErrors] = useState()
	const handleSubmit = (values) =>{
		setIsLoading(true)
		const body = JSON.stringify(values)
		const options = {method:"POST",body:body,headers : {"Content-Type":"application/json"},signal:AbortSignal.timeout(150000)}
		fetch(`${BaseUrl}/auth/register`,options)
		.then(response => {
			if (response.ok){
				context.fetchCart()
				return response.json()
				
			}
			if (response.status === 400){
				context.message("error","Email already exists")
				setIsLoading(false)
				setErrors(true)
				// return response.json()
				throw new Error("400")

				
				
			}
		})
		.then(data => {
			console.log(data)
			
			SetIsModalVisible(false)
			localStorage.setItem("user_token",data.token)
			localStorage.setItem("email",data.email)
			localStorage.setItem("confirmed",data.confirmed)
			
			context.message("success",'Succesfully Login')


		})
		.catch(error => {
			
			context.message('error',error.message)
			
		})
	}
	return (

	<Form form ={form} name='register' style={{marginTop:"20px",paddingTop:"10px",paddingLeft:"30px",paddingRight:"30px"}} onFinish={handleSubmit}>
	<Typography.Title>DigiGizmo </Typography.Title>

	<Form.Item name="email" rules={[{required:"true",message:"Plaease input your Email"}]}>
		<Input placeholder="Email" />

	</Form.Item>

	<Form.Item name="first_name" rules={[{required:"true",message:"Plaease input your First Name"}]}>
		<Input placeholder="First Name" />

	</Form.Item>

	<Form.Item name="last_name" rules={[{required:"true",message:"Plaease input your Last Name"}]}>
		<Input placeholder="Last Name" />

	</Form.Item>

	<Form.Item name="password" 
		rules={[{required:"true",
			message:"Plaease input your password"}]} 
		style={{marginTop:"40px"}} hasFeedback>
		<Input.Password placeholder="Password" />

	</Form.Item>

	<Form.Item name="confirm" 
		dependencies={['password']}
		rules={[{required:"true",
			message:"Plaease input your password"},{'validator':validatePassword}]} 
		style={{marginTop:"40px"}} hasFeedback>
		<Input.Password placeholder="Confirm Password" />

	</Form.Item>

	<Form.Item>
		<Button  type="primary" htmlType='submit' style={{width:"50%"}}>
			Register
		</Button>
		{error && <p style={{color:"red"}}>Email Already exists</p>}

	</Form.Item>
	{isLoading && <Spin tip="Loging in"/>}
	</Form>

		)
}
export default RegisterForm