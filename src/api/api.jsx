import axios from "axios"


export const NodeURL = import.meta.env.VITE_NODE_URL
// export const NodeURL = 'http://127.0.0.1:8000'


export const client = axios.create({
    baseURL:NodeURL
})

client.defaults.responseType= 'json'


client.interceptors.request.use(function(config){
    const authToken = localStorage.getItem('Genera-token');
    if(authToken){
        config.headers['Authorization']=authToken
    }

    return config
})


const request = (options)=>{
    const onSuccess =(response)=>{
        if(response.data?.status==='00'){
            localStorage.removeItem('Genera-token')
            window.location ='/'
        }
        return response.data
    }

    const onError =(error)=>{
        if(error.response){

        }else{

        }

        return Promise.reject(error.response || error.message);
    }

    return client(options).then(onSuccess).catch(onError);
}

export default request;