import axios from 'axios';
import { LANGUAGE_VERSIONS } from '../constraints';

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

export const executeCode = async (language, sourceCode) => {
    const res = await API.post("/execute", {
        language : language,
        version : LANGUAGE_VERSIONS[language],
        files : [
            {
                content : sourceCode
            }
        ]
    })
    return res.data;
}