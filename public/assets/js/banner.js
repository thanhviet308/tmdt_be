// Banner Admin JS
const API_BASE = "/api/admin/banners";

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    return {
        Authorization: `Bearer ${getToken()}`,
    };
}

// Format date for datetime-local input
function formatDateTimeLocal(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 16);
}

// ============ SHOW PAGE ============
async function loadBanners(page = 1) {
    const tbody = document.getElementById("bannerTableBody");
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="text-center">Đang tải...</td></tr>';

    try {
        const res = await fetch(`${API_BASE}?page=${page}&limit=10`, {
            headers: authHeaders(),
        });
        const data = await res.json();

        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">${data.message}</td></tr>`;
            return;
        }

        const banners = data.data?.banners || [];
        if (banners.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Chưa có banner nào</td></tr>';
            return;
        }

        tbody.innerHTML = banners
            .map(
                (b) => `
            <tr>
                <td>${b.id}</td>
                <td><img src="${b.image}" class="banner-img" alt="${b.title}" onerror="this.src='/assets/img/no-image.png'" /></td>
                <td>
                    <strong>${b.title}</strong>
                    ${b.link ? `<br><small class="text-muted">${b.link}</small>` : ""}
                </td>
                <td><span class="badge bg-info">${b.type}</span></td>
                <td>${b.position}</td>
                <td>
                    <span class="badge ${b.isActive ? "badge-active" : "badge-inactive"}" style="cursor:pointer" onclick="toggleBanner(${b.id})">
                        ${b.isActive ? "Đang hiển thị" : "Đã ẩn"}
                    </span>
                </td>
                <td>
                    <a href="/admin/banner/update.html?id=${b.id}" class="btn btn-sm btn-warning">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-sm btn-danger" onclick="deleteBanner(${b.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
            )
            .join("");

        // Pagination
        renderPagination(data.data?.pagination, page);
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Lỗi: ${err.message}</td></tr>`;
    }
}

function renderPagination(pagination, currentPage) {
    const paginationEl = document.getElementById("pagination");
    if (!paginationEl || !pagination) return;

    const { totalPages } = pagination;
    let html = "";

    // Previous
    html += `<li class="page-item ${currentPage <= 1 ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="loadBanners(${currentPage - 1}); return false;">Trước</a>
    </li>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? "active" : ""}">
            <a class="page-link" href="#" onclick="loadBanners(${i}); return false;">${i}</a>
        </li>`;
    }

    // Next
    html += `<li class="page-item ${currentPage >= totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="loadBanners(${currentPage + 1}); return false;">Sau</a>
    </li>`;

    paginationEl.innerHTML = html;
}

async function toggleBanner(id) {
    if (!confirm("Bạn có chắc muốn thay đổi trạng thái banner này?")) return;

    try {
        const res = await fetch(`${API_BASE}/${id}/toggle`, {
            method: "PATCH",
            headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            loadBanners();
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (err) {
        alert("Lỗi: " + err.message);
    }
}

async function deleteBanner(id) {
    if (!confirm("Bạn có chắc muốn xóa banner này?")) return;

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success) {
            alert("Xóa banner thành công!");
            loadBanners();
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (err) {
        alert("Lỗi: " + err.message);
    }
}

// ============ CREATE PAGE ============
function setupCreateForm() {
    const form = document.getElementById("bannerForm");
    if (!form || window.location.pathname.includes("update.html")) return;

    // Image preview
    const imageInput = document.getElementById("image");
    const imagePreview = document.getElementById("imagePreview");
    if (imageInput && imagePreview) {
        imageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                imagePreview.src = URL.createObjectURL(file);
                imagePreview.classList.remove("d-none");
            }
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        formData.set("isActive", document.getElementById("isActive").checked);

        try {
            const res = await fetch(API_BASE, {
                method: "POST",
                headers: authHeaders(),
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                alert("Tạo banner thành công!");
                window.location.href = "/admin/banner/show.html";
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    });
}

// ============ UPDATE PAGE ============
async function setupUpdateForm() {
    const form = document.getElementById("bannerForm");
    if (!form || !window.location.pathname.includes("update.html")) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) {
        alert("Không tìm thấy ID banner");
        window.location.href = "/admin/banner/show.html";
        return;
    }

    document.getElementById("bannerId").value = id;

    // Load banner data
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            headers: authHeaders(),
        });
        const data = await res.json();

        if (!data.success) {
            alert("Lỗi: " + data.message);
            window.location.href = "/admin/banner/show.html";
            return;
        }

        const banner = data.data;
        document.getElementById("title").value = banner.title || "";
        document.getElementById("type").value = banner.type || "main";
        document.getElementById("link").value = banner.link || "";
        document.getElementById("position").value = banner.position || 0;
        document.getElementById("description").value = banner.description || "";
        document.getElementById("isActive").checked = banner.isActive;
        document.getElementById("startDate").value = formatDateTimeLocal(banner.startDate);
        document.getElementById("endDate").value = formatDateTimeLocal(banner.endDate);

        const imagePreview = document.getElementById("imagePreview");
        if (banner.image && imagePreview) {
            imagePreview.src = banner.image;
            imagePreview.classList.remove("d-none");
        }
    } catch (err) {
        alert("Lỗi: " + err.message);
    }

    // Image preview on change
    const imageInput = document.getElementById("image");
    const imagePreview = document.getElementById("imagePreview");
    if (imageInput && imagePreview) {
        imageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                imagePreview.src = URL.createObjectURL(file);
            }
        });
    }

    // Submit form
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        formData.set("isActive", document.getElementById("isActive").checked);

        // Remove image if not changed
        if (!document.getElementById("image").files[0]) {
            formData.delete("image");
        }

        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: "PUT",
                headers: authHeaders(),
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                alert("Cập nhật banner thành công!");
                window.location.href = "/admin/banner/show.html";
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    });
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("/admin/banner/show.html")) {
        loadBanners();
    } else if (path.includes("/admin/banner/create.html")) {
        setupCreateForm();
    } else if (path.includes("/admin/banner/update.html")) {
        setupUpdateForm();
    }
});

