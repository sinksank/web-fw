import axios from 'axios';
const url = "http://localhost:8080"
const instance = axios.create({url})

export const Get = ()=>{
    return instance.get('/hello')
}