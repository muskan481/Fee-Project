import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:4000/api' })
API.getJSON = (url, token) => API.get(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r=>r.data)
API.postJSON = (url, data, token) => API.post(url, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r=>r.data)
API.postForm = (url, form, token) => API.post(url, form, { headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, token ? { Authorization: `Bearer ${token}` } : {}) }).then(r=>r.data)
API.putForm = (url, form, token) => API.put(url, form, { headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, token ? { Authorization: `Bearer ${token}` } : {}) }).then(r=>r.data)
API.deleteJSON = (url, token) => API.delete(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r=>r.data)

export default API
