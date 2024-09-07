import { makeRequest } from '../components/Ws';

export async function addCategory(formData) {
    const json = await makeRequest('POST', 'api/categoria', formData);
    return json;
}


export async function getCategories(formData) {
    const json = await makeRequest('GET', 'api/categorias', formData);
    return json;
}

export async function getCategory(id) {
    const json = await makeRequest('GET', `api/categoria/${id}`);
    return json;
}

export async function putCategories(id, formData) {
    const json = await makeRequest('PUT', `api/categoria/${id}`, formData);
    return json;
}

export async function deleteCategory(id) {
    const json = await makeRequest('DELETE', `api/categoria/${id}`);
    return json;
}