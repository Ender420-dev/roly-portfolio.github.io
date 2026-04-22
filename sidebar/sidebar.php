

<div class="sidebar d-flex flex-column vh-100 position-fixed shadow-lg" id="sidebar">
  <!-- Header with close button for mobile -->
  <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
    <div class="d-flex align-items-center">
      <img src="" alt="Logo" class="rounded-circle me-2 border border-light" style="width:50px;height:50px;">
      <div>
        <div class="fw-bold fs-6">MIS4</div>
      </div>
    </div>
    <!-- Close button for mobile -->
    <button id="closeSidebarBtn" class="btn btn-link text-white p-0 d-md-none" style="font-size: 1.5rem; line-height: 1;">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>
  
  <!-- Navigation -->
  <div class="mt-4 flex-grow-1">
    <a href="../dashboard/dashboard.php" class="nav-link px-3 py-2">
      <i class="bi bi-bar-chart-line-fill me-3"></i> Dashboard
    </a>
    <a href="../ml/ml.php" class="nav-link px-3 py-2">
      <i class="bi bi-database me-3"></i> Masterlist
    </a>
    <a href="../rp/rp.php" class="nav-link px-3 py-2">
      <i class="bi bi-send me-3"></i> Route Plan
    </a>
    <a href="../dt/dt.php" class="nav-link px-3 py-2">
      <i class="bi bi-truck me-3"></i> Delivery Tracker
    </a>
    <a href="../dm/dm.php" class="nav-link px-3 py-2">
      <i class="bi bi-phone me-3"></i> Device Management
    </a>
    <a href="../report/report.php" class="nav-link px-3 py-2">
      <i class="bi bi-graph-up me-3"></i> Delivery Reports
    </a>
    <a href="../users/users.php" class="nav-link px-3 py-2">
     <i class="bi bi-person-check-fill me-3"></i> Manage Users
    </a>
    <a href="../uploader/uploader.php" class="nav-link px-3 py-2">
      <i class="bi bi-cloud-upload me-3"></i> Manage Upload
    </a>
     <a href="../log/log.php" class="nav-link px-3 py-2">
      <i class="bi bi-journal me-3"></i> Activity & Incident Log
    </a>
  </div>
  
  <!-- User Info Dropdown - ALWAYS UPWARD -->
  <div class="user-box mt-auto p-3 border-top">
    <div class="dropdown dropup"> <!-- dropup class makes it open upward -->
      <button 
        class="btn btn-link text-decoration-none text-light dropdown-toggle w-100 p-0 border-0" 
        type="button" 
        id="userMenu" 
        aria-expanded="false"
        style="background: transparent; position: relative; overflow: visible !important; display: flex; align-items: center; justify-content: space-between;"
      >
        <div class="d-flex align-items-center">
          <div class="rounded-circle border border-light me-3 d-flex align-items-center justify-content-center" 
               style="width:40px;height:40px;background:#ffffff22;">
            <span class="fw-bold"><?php echo strtoupper(substr($userName, 0, 1)); ?></span>
          </div>
          <div class="text-start">
            <div class="fw-semibold text-light"><?php echo htmlspecialchars($userName); ?></div>
            <span class="small text-light"><?php echo htmlspecialchars($userRole); ?></span>
          </div>
        </div>
        <i class="bi bi-chevron-up ms-2" style="transition: transform 0.3s ease;"></i>
      </button>

      <ul class="dropdown-menu dropdown-menu-end shadow border-0 mb-2" aria-labelledby="userMenu" style="position: absolute; bottom: 100% !important; top: auto !important; left: 0 !important; right: auto !important; min-width: 200px;">
        <li>
          <a class="dropdown-item py-2" href="../account/account.php">
            <i class="bi bi-person-fill-gear me-2"></i> Account Settings
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item py-2 text-danger" href="../../logout.php">
            <i class="bi bi-box-arrow-right me-2"></i> Log Out
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>

<style>
/* Sidebar dropdown styles */
.sidebar .dropdown-menu {
    background: linear-gradient(135deg, #a0041e, #ce0526) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
    padding: 8px 0 !important;
    margin-bottom: 8px !important;
}

.sidebar .dropdown-item {
    color: #ffcdd2 !important;
    padding: 10px 20px !important;
    transition: all 0.2s ease !important;
    font-weight: 500 !important;
}

.sidebar .dropdown-item:hover {
    background: linear-gradient(90deg, #1406dd, #ce0526) !important;
    color: white !important;
    transform: translateX(5px) !important;
}

.sidebar .dropdown-item i {
    margin-right: 8px;
    font-size: 1rem;
}

.sidebar .dropdown-divider {
    border-top: 1px solid rgba(255,255,255,0.1) !important;
    margin: 5px 0 !important;
}

.sidebar .dropdown-toggle::after {
    display: none !important;
}

.sidebar .dropdown-toggle .bi-chevron-up,
.sidebar .dropdown-toggle .bi-chevron-down {
    transition: transform 0.3s ease;
}

.sidebar .user-box {
    position: relative;
    overflow: visible !important;
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .sidebar .dropdown-menu {
        position: fixed !important;
        bottom: auto !important;
        top: auto !important;
        left: 20px !important;
        right: 20px !important;
        width: calc(100% - 40px) !important;
        transform: none !important;
        margin-bottom: 70px !important;
    }
}
</style>
