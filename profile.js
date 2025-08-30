
const token = localStorage.getItem('token');
let userId = null;

function showNotification(message, type = 'success') {
    const area = document.getElementById('notification-area');
    if (!area) return alert(message);
    area.innerHTML = `<div class="notification bg-${type === 'success' ? 'success' : 'danger'} text-light">${message}</div>`;
    setTimeout(() => { area.innerHTML = ''; }, 2500);
}

function showLoading(show = true) {
    let loader = document.getElementById('profile-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'profile-loader';
        loader.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        loader.style.position = 'fixed';
        loader.style.top = '50%';
        loader.style.left = '50%';
        loader.style.transform = 'translate(-50%, -50%)';
        loader.style.zIndex = '9999';
        document.body.appendChild(loader);
    }
    loader.style.display = show ? 'block' : 'none';
}

window.onload = async () => {
    showLoading(true);
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
        // Fetch user details from backend
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        let user = await res.json();
        if (user.username) document.getElementById('username').value = user.username;
        if (user.email) document.getElementById('email').value = user.email;
        // Optionally update avatar
        const avatarEls = document.querySelectorAll('.avatar');
        avatarEls.forEach(el => el.src = `https://randomuser.me/api/portraits/men/${userId % 99}.jpg`);
    } catch (err) {
        showNotification('Failed to load profile', 'danger');
    }
    showLoading(false);
};

document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    showLoading(true);
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username, email })
        });
        const data = await res.json();
        showNotification(data.msg, res.ok ? 'success' : 'danger');
    } catch (err) {
        showNotification('Update failed', 'danger');
    }
    showLoading(false);
});

// Modal for password change
function showPasswordModal() {
    let modal = document.getElementById('passwordModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'passwordModal';
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title">Change Password</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="password" id="newPassword" class="form-control mb-3" placeholder="New Password">
                    <button id="savePasswordBtn" class="btn btn-primary w-100">Save</button>
                </div>
            </div>
        </div>`;
        document.body.appendChild(modal);
    }
    var bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    document.getElementById('savePasswordBtn').onclick = async function() {
        const password = document.getElementById('newPassword').value;
        if (!password) return showNotification('Password required', 'danger');
        showLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/users/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            showNotification(data.msg, res.ok ? 'success' : 'danger');
            bsModal.hide();
        } catch (err) {
            showNotification('Password change failed', 'danger');
        }
        showLoading(false);
    };
}

document.getElementById('changePasswordBtn').onclick = function() {
    showPasswordModal();
};
