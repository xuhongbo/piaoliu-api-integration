// api.js - 通用 API 请求工具

// API 基础 URL
const BASE_URL = 'http://localhost:3000/api';

// 获取存储的令牌
const getToken = () => {
  return localStorage.getItem('auth_token');
};

// 设置认证令牌
const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// 创建请求头
const createHeaders = (needAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (needAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// 处理 API 响应
const handleResponse = async (response) => {
  if (!response.ok) {
    // 如果是 401 未授权，清除令牌
    if (response.status === 401) {
      setToken(null);
    }
    
    // 尝试获取错误详情
    let errorDetail;
    try {
      const errorData = await response.json();
      errorDetail = errorData.message || '请求失败';
    } catch (e) {
      errorDetail = '请求失败';
    }
    
    throw new Error(errorDetail);
  }
  
  return response.json();
};

// 通用 GET 请求方法
const get = async (endpoint, params = {}, needAuth = true) => {
  // 构建 URL 查询参数
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(needAuth)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
};

// 通用 POST 请求方法
const post = async (endpoint, data, needAuth = true) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(needAuth),
      body: JSON.stringify(data)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
};

// 通用 PUT 请求方法
const put = async (endpoint, data, needAuth = true) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: createHeaders(needAuth),
      body: JSON.stringify(data)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
};

// 通用 DELETE 请求方法
const del = async (endpoint, needAuth = true) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(needAuth)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
};

// ==================== 具体业务 API 方法 ====================

// ----- 预约管理 API -----

// 创建预约
const createReservation = (reservationData) => {
  return post('/reservations', reservationData);
};

// 获取所有预约
const getReservations = (params = {}) => {
  return get('/reservations', params);
};

// 获取单个预约详情
const getReservationById = (id) => {
  return get(`/reservations/${id}`);
};

// 更新预约状态
const updateReservationStatus = (id, statusData) => {
  return put(`/reservations/${id}/status`, statusData);
};

// 获取用户的预约记录
const getUserReservations = (userId) => {
  return get(`/reservations/user/${userId}`);
};

// ----- 活动参与 API -----

// 激活用户活动
const activateActivity = (data) => {
  return post('/activities/activate', data);
};

// 获取活动参与记录
const getActivityById = (id) => {
  return get(`/activities/${id}`);
};

// 获取用户的活动参与记录
const getUserActivities = (userId) => {
  return get(`/activities/user/${userId}`);
};

// 更新活动完成状态
const updateActivityStatus = (id, statusData) => {
  return put(`/activities/${id}/status`, statusData);
};

// ----- 任务打卡 API -----

// 验证任务完成
const verifyTask = (id, verificationData) => {
  return put(`/tasks/${id}/verify`, verificationData);
};

// 获取任务详情
const getTaskById = (id) => {
  return get(`/tasks/${id}`);
};

// 获取活动的所有任务
const getActivityTasks = (activityId) => {
  return get(`/tasks/activity/${activityId}`);
};

// 获取用户当天需要完成的任务
const getUserTodayTasks = (userId) => {
  return get(`/tasks/user/${userId}/today`);
};

// 标记任务为无效
const markTaskInvalid = (id) => {
  return put(`/tasks/${id}/invalid`, {});
};

// ----- 邀请裂变 API -----

// 创建邀请
const createInvitation = (invitationData) => {
  return post('/invitations', invitationData);
};

// 接受邀请
const acceptInvitation = (code, inviteeData) => {
  return post(`/invitations/accept/${code}`, inviteeData);
};

// 标记邀请为已参与活动
const markInvitationParticipated = (id, participationData) => {
  return put(`/invitations/${id}/participate`, participationData);
};

// 获取邀请详情
const getInvitationById = (id) => {
  return get(`/invitations/${id}`);
};

// 通过邀请码获取邀请信息
const getInvitationByCode = (code) => {
  return get(`/invitations/code/${code}`);
};

// 获取用户发出的邀请
const getUserSentInvitations = (userId, params = {}) => {
  return get(`/invitations/user/${userId}/sent`, params);
};

// API工具导出
const api = {
  // 认证相关
  getToken,
  setToken,
  
  // 通用请求方法
  get,
  post,
  put,
  del,
  
  // 预约API
  createReservation,
  getReservations,
  getReservationById,
  updateReservationStatus,
  getUserReservations,
  
  // 活动API
  activateActivity,
  getActivityById,
  getUserActivities,
  updateActivityStatus,
  
  // 任务API
  verifyTask,
  getTaskById,
  getActivityTasks,
  getUserTodayTasks,
  markTaskInvalid,
  
  // 邀请API
  createInvitation,
  acceptInvitation,
  markInvitationParticipated,
  getInvitationById,
  getInvitationByCode,
  getUserSentInvitations
};

// 导出API工具对象
window.api = api;