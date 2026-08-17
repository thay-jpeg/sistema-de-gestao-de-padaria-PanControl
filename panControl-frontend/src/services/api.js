import axios from 'axios';

// Instância do axios com as configurações base
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // porta do Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;