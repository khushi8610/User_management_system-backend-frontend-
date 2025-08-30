const token = localStorage.getItem('token');
async function fetchUsers(query = '') {
    const res = await fetch('http://localhost:5000/api/users' + (query ? `?search=${query}` : ''), {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const users = await res.json();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    users.forEach(user => {
        tbody.innerHTML += `<tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="editUser('${user._id}')" class="btn btn-warning btn-sm">Edit</button>
                <button onclick="deleteUser('${user._id}')" class="btn btn-danger btn-sm">Delete</button>
            </td>
        </tr>`;
    });
}
document.getElementById('search').addEventListener('input', e => fetchUsers(e.target.value));
window.onload = () => fetchUsers();
function deleteUser(id) {
    fetch('http://localhost:5000/api/users/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(() => fetchUsers());
}
function editUser(id) {
    // Implement edit user modal or redirect
    alert('Edit user feature coming soon!');
}
document.getElementById('addUserBtn').onclick = () => alert('Add user feature coming soon!');
