import { makeRequest } from '../components/Ws';

export async function addProduct(formData) {
    const json = await makeRequest('POST', 'api/produto', formData);
    return json;
}

export async function getProducts(categoryId = null) {
    const url = categoryId ? `api/produtos?category_id=${categoryId}` : 'api/produtos';
    const json = await makeRequest('GET', url);
    return json;
}


export async function getProduct(id) {
    const json = await makeRequest('GET', `api/produto/${id}`);
    return json;
}

export async function putProducts(id, formData) {
    const json = await makeRequest('POST', `api/produto/${id}`, formData);
    return json;
}

export async function deleteProduct(id) {
    const json = await makeRequest('DELETE', `api/produto/${id}`);
    return json;
}