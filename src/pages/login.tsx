import {Button} from "@/components/ui/button";
import {Card,CardContent} from "@/components/ui/card";
import {Link,useNavigate} from "react-router-dom";
import {Mail,Lock,ArrowRight} from "lucide-react";
import {useState} from "react";
import {useToast} from "@/hooks/useToast";
const Login =() =>{
    const  {toast}=useToast();
    const navigate =useNavigate();
    const [formData,setFormData]=useState({
        email:"",
        password:""
    });
    
}
