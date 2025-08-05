const API_BASE_URL = "http://localhost:4000";

async function handleRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json(); // Parsear JSON
    return { status: response.status, data }; // Retornar estado y datos
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
}

// Funciones genéricas
async function fetchData(endpoint) {
  return handleRequest(endpoint, { method: "GET" });
}

async function postData(endpoint, data) {
  const isFormData = data instanceof FormData;

  return handleRequest(endpoint, {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });
}

async function putData(endpoint, data) {
  const isFormData = data instanceof FormData;

  return handleRequest(endpoint, {
    method: "PUT",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });
}

async function deleteData(endpoint) {
  return handleRequest(endpoint, { method: "DELETE" });
}

export async function getCredentials(username, password) {
  return postData("auth/login", { username, password });
}

// CRUD específico para "users"
export async function getUsers() {
  return fetchData("activos");
}

export async function getUser(id) {
  return fetchData(`users/${id}`);
}

export async function createUser(user) {
  return postData("users", user);
}

export const updateUser = (id, data) => {
  const isFormData = data instanceof FormData;

  return fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  }).then(async (res) => {
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al actualizar usuario");
    return { status: res.status, data: result };
  });
};

export const getUserById = async (id) => {
  const res = await fetch(`http://localhost:4000/users/${id}`);
  if (!res.ok) {
    throw new Error("No se pudo obtener el usuario");
  }
  return res.json();
};

export async function deleteUser(id) {
  return deleteData(`users/${id}`);
}

// CRUD específico para "items"
export async function getItems() {
  return fetchData("items");
}

export async function getItem(id) {
  return fetchData(`items/${id}`);
}

export async function createItem(item) {
  // Admite FormData o JSON
  return postData("items", item);
}

export async function updateItem(id, item) {
  // Admite FormData o JSON
  return putData(`items/${id}`, item);
}

export async function deleteItem(id) {
  return deleteData(`items/${id}`);
}

// Obtener categorías
export async function getCategories(type) {
  return fetchData(`categories/${type}`);
}

export async function getStores(valor) {
  return fetchData(`stores/${valor}`)
}

export async function getMachines() {
  return fetchData("machines");
}

export async function getMachineDetail(id) {
  return fetchData(`machines/${id}`);
}

export async function createMachine(machine) {
  return postData("machines", machine);
}

export async function updateMachine(id, machine) {
  // Admite FormData o JSON
  return putData(`machines/${id}`, machine);
}

export async function deleteMachine(id) {
  return deleteData(`machines/${id}`);
}

export async function getBranches() {
  return fetchData("branches")
}

export async function getRoles() {
  return fetchData("roles")
}
//REPORTES
//1.REPORTE GENERAL
export const getUserInvestmentReport = async ({ userId, month, year, mode }) => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (month && mode === 'month') params.append('month', month);
  if (year) params.append('year', year);
  if (mode) params.append('mode', mode); // ✅

  const res = await fetch(`http://localhost:4000/api/transactions/report?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
};



export const getItemMovementReport = async (itemId) => {
  const res = await fetch(`http://localhost:4000/api/transactions/report/item-movements?itemId=${itemId}`);
  if (!res.ok) {
    throw new Error("No se pudo obtener el reporte de movimientos del ítem");
  }
  return res.json();
};
//DETALLE
export const getUserDetailedTransactionReport = async ({ userId, month, year, codigoitem }) => {
  const params = new URLSearchParams();

  if (userId) params.append("userId", userId);
  if (month) params.append("month", month);
  if (year) params.append("year", year);
  if (codigoitem) params.append("codigoitem", codigoitem);

  const res = await fetch(`${API_BASE_URL}/api/transactions/report/user-detailed?${params.toString()}`);

  if (!res.ok) {
    throw new Error("No se pudo obtener el reporte detallado del usuario");
  }

  return res.json();
};


export const getAllItemTransactions = async () => {
  const res = await fetch("http://localhost:4000/api/transactions/report/all-transactions");
  if (!res.ok) throw new Error("Error al obtener las transacciones");
  return res.json();
};
export const getAllTransactionsReport = async (paramsObj = {}) => {
  const params = new URLSearchParams(paramsObj).toString();
  const res = await fetch(`http://localhost:4000/api/transactions/report/all-transactions?${params}`);
  if (!res.ok) {
    throw new Error("No se pudo obtener el reporte completo");
  }
  return res.json();
};

export const getItemAssignmentsReport = async (codigoitem, year, month, userid,branchId) => {
  const params = new URLSearchParams();

  if (year) params.append('year', year);
  if (month) params.append('month', month);
  if (userid) params.append('userid', userid); // ✅ Filtro adicional
  if (branchId) params.append("branchId", branchId);

  const url = `http://localhost:4000/api/reportes/asignaciones/${codigoitem}?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("No se pudo obtener el reporte de asignaciones");
  }

  return res.json();
};









