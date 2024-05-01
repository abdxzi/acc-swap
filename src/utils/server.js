import axios from 'axios';

export class Server {
    static async get(url) {
        try {
            const response = await axios.get(url);
            return response.data
        } catch(e) {
            throw Error("AXIOS: GET ERROR")
        }
    }

    static async post(url, postData, config) {

        try {
            const response = await axios.post(url, postData, config);
            return response.data;
        } catch(e) {
            throw Error("AXIOS: POST ERROR")
        }
    }
}
