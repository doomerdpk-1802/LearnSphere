const pages = {
  home: document.getElementById("home-page"),
  signup: document.getElementById("signup-page"),
  login: document.getElementById("login-page"),
  courses: document.getElementById("courses-page"),
  adminDashboard: document.getElementById("admin-dashboard"),
};

let currentPage = "home";
let currentUser = null;
let currentCourseId = null;

let adminCourses = [];

const dummyPurchasedCourses = [];

function saveUserDataToStorage(userData, role) {
  localStorage.setItem("currentUser", JSON.stringify(userData));
  localStorage.setItem("userRole", role);
  if (userData.message) {
    localStorage.setItem("userGreeting", userData.message);
  }
}

function loadUserDataFromStorage() {
  const storedUser = localStorage.getItem("currentUser");
  const storedRole = localStorage.getItem("userRole");
  const storedGreeting = localStorage.getItem("userGreeting");

  if (storedUser && storedRole) {
    try {
      currentUser = JSON.parse(storedUser);
      if (storedGreeting) {
        if (storedRole === "admin") {
          const adminGreeting = document.getElementById("admin-greeting");
          if (adminGreeting) adminGreeting.textContent = storedGreeting;
        } else {
          const userGreeting = document.getElementById("user-greeting");
          if (userGreeting) userGreeting.textContent = storedGreeting;
        }
      }

      return { user: currentUser, role: storedRole, greeting: storedGreeting };
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      clearUserDataFromStorage();
    }
  }
  return null;
}

function clearUserDataFromStorage() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userGreeting");
  localStorage.removeItem("authToken");
  localStorage.removeItem("adminCourses");
}

function saveAdminCoursesToStorage(courses) {
  localStorage.setItem("adminCourses", JSON.stringify(courses));
}

function loadAdminCoursesFromStorage() {
  const stored = localStorage.getItem("adminCourses");
  if (stored) {
    try {
      adminCourses = JSON.parse(stored);
      return true;
    } catch (error) {
      console.error("Error parsing stored admin courses:", error);
      localStorage.removeItem("adminCourses");
    }
  }
  return false;
}

function renderAdminCourses() {
  const adminCoursesGrid = document.getElementById("admin-courses-grid");

  if (adminCourses && adminCourses.length > 0) {
    adminCoursesGrid.innerHTML = adminCourses
      .map(
        (course) => `
        <div class="admin-course-card course-card">
          <div class="admin-course-actions">
            <button class="action-btn edit-btn" onclick="editCourse('${course._id}')">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteCourse('${course._id}')">Delete</button>
          </div>
          <img src="${course.imageUrl}" alt="${course.title}" class="course-image">
          <div class="course-content">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <h3 class="course-title">${course.title}</h3>
              <span class="course-status" style="background: var(--success); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600;">Published</span>
            </div>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
              <div class="course-creator">
                <strong>By:</strong> Admin
              </div>
              <div class="course-price">$${course.price}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--text-secondary);">
              <span><strong>Students:</strong> 0</span>
              <span><strong>Revenue:</strong> $0</span>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  } else {
    adminCoursesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
        <p>No courses found. Create your first course to get started!</p>
      </div>
    `;
  }
}

async function loadAdminCourses() {
  const hasStoredData = loadAdminCoursesFromStorage();
  if (hasStoredData) {
    renderAdminCourses();
  }

  const adminCoursesGrid = document.getElementById("admin-courses-grid");

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }

    const response = await fetch(
      "http://learnsphere-vercel.api.deepak.cfd/api/v1/admin/my-courses",
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      if (result.courses && result.courses.length > 0) {
        adminCourses = result.courses;
        saveAdminCoursesToStorage(adminCourses);
        renderAdminCourses();
      } else {
        adminCourses = [];
        localStorage.removeItem("adminCourses");
        adminCoursesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
            <p>No courses found. Create your first course to get started!</p>
          </div>
        `;
      }
    } else {
      console.error("Failed to fetch courses:", result.error);
      alert("Failed to load courses: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    alert("Network error while loading courses. Please try again.");
  }
}

function showPage(pageName) {
  Object.values(pages).forEach((page) => {
    page.classList.remove("active");
  });

  if (pages[pageName]) {
    pages[pageName].classList.add("active");
    currentPage = pageName;

    history.pushState({ page: pageName }, "", `#${pageName}`);
  }
}

function showHome() {
  showPage("home");
}

function showSignup() {
  showPage("signup");
}

function showLogin() {
  showPage("login");
}

function showCourses() {
  showPage("courses");
  showPurchasedCourses();
}

function showAdminDashboard() {
  showPage("adminDashboard");
  const hasStoredData = loadAdminCoursesFromStorage();
  if (hasStoredData) {
    renderAdminCourses();
  }
  loadAdminCourses();
}

function logout() {
  currentUser = null;
  clearUserDataFromStorage();
  showHome();
}

function showPurchasedCourses() {
  const purchasedSection = document.getElementById("purchased-section");
  const availableSection = document.getElementById("available-section");
  const purchasedToggle = document.getElementById("purchased-toggle");
  const availableToggle = document.getElementById("available-toggle");

  purchasedSection.classList.add("active");
  availableSection.classList.remove("active");

  purchasedToggle.classList.add("active");
  availableToggle.classList.remove("active");
}

function showAvailableCourses() {
  const purchasedSection = document.getElementById("purchased-section");
  const availableSection = document.getElementById("available-section");
  const purchasedToggle = document.getElementById("purchased-toggle");
  const availableToggle = document.getElementById("available-toggle");

  availableSection.classList.add("active");
  purchasedSection.classList.remove("active");

  availableToggle.classList.add("active");
  purchasedToggle.classList.remove("active");
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
  const sunIcons = document.querySelectorAll("#sun-icon, #sun-icon-courses");
  const moonIcons = document.querySelectorAll("#moon-icon, #moon-icon-courses");

  if (theme === "dark") {
    sunIcons.forEach((icon) => (icon.style.display = "none"));
    moonIcons.forEach((icon) => (icon.style.display = "block"));
  } else {
    sunIcons.forEach((icon) => (icon.style.display = "block"));
    moonIcons.forEach((icon) => (icon.style.display = "none"));
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcons(theme);
}

function validateSignupForm(userData) {
  const { firstName, email, password } = userData;

  if (!firstName || firstName.length < 1 || firstName.length > 100) {
    alert("First name must be between 1 and 100 characters.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!password || password.length < 8 || password.length > 20) {
    alert("Password must be between 8 and 20 characters long.");
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    alert("Password must contain at least one uppercase letter.");
    return false;
  }

  if (!/[a-z]/.test(password)) {
    alert("Password must contain at least one lowercase letter.");
    return false;
  }

  if (!/[0-9]/.test(password)) {
    alert("Password must contain at least one number.");
    return false;
  }

  if (!/[@$!%*?&]/.test(password)) {
    alert(
      "Password must contain at least one special character (@, $, !, %, *, ?, &)."
    );
    return false;
  }

  return true;
}

function validateCourseForm(courseData) {
  const { title, description, price, imageUrl } = courseData;

  if (!title || title.length < 5 || title.length > 50) {
    alert("Title must be between 5 and 50 characters.");
    return false;
  }

  if (!description || description.length < 20 || description.length > 300) {
    alert("Description must be between 20 and 300 characters.");
    return false;
  }

  if (!price || isNaN(price) || price <= 0) {
    alert("Price must be a positive number.");
    return false;
  }

  try {
    new URL(imageUrl);
  } catch {
    alert("Please enter a valid image URL.");
    return false;
  }

  return true;
}

function showCreateCourseModal() {
  currentCourseId = null;
  document.getElementById("modal-title").textContent = "Create New Course";
  document.getElementById("course-submit-btn").textContent = "Create Course";
  document.getElementById("course-form").reset();
  document.getElementById("course-modal").classList.add("active");
}

function editCourse(courseId) {
  const course = adminCourses.find((c) => c._id === courseId);
  if (course) {
    currentCourseId = courseId;
    document.getElementById("modal-title").textContent = "Edit Course";
    document.getElementById("course-submit-btn").textContent = "Update Course";

    document.getElementById("courseTitle").value = course.title;
    document.getElementById("courseDescription").value = course.description;
    document.getElementById("coursePrice").value = course.price;
    document.getElementById("courseCreator").value = "Admin";
    document.getElementById("courseImage").value = course.imageUrl;

    document.getElementById("course-modal").classList.add("active");
  }
}

function closeCourseModal() {
  document.getElementById("course-modal").classList.remove("active");
  currentCourseId = null;
}

async function deleteCourse(courseId) {
  const course = adminCourses.find((c) => c._id === courseId);
  if (course) {
    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Authentication required. Please log in again.");
          return;
        }

        const response = await fetch(
          "http://learnsphere-vercel.api.deepak.cfd/api/v1/admin/delete-course",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ courseId }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert(`"${course.title}" has been deleted successfully!`);
          loadAdminCourses();
        } else {
          let errorMessage = "Failed to delete course. Please try again.";
          if (result.error) {
            errorMessage = result.error;
          }
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Delete course error:", error);
        alert("Network error. Please check your connection and try again.");
      }
    }
  }
}

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page) {
    showPage(event.state.page);
  } else {
    showPage("home");
  }
});

window.addEventListener("load", () => {
  const storedUserData = loadUserDataFromStorage();
  const token = localStorage.getItem("authToken");

  if (storedUserData && token) {
    currentUser = storedUserData.user;

    if (storedUserData.role === "admin") {
      showAdminDashboard();
      return;
    } else {
      showCourses();
      return;
    }
  }

  const hash = window.location.hash.substring(1);
  if (hash && pages[hash]) {
    showPage(hash);
    if (hash === "adminDashboard") {
      const hasStoredData = loadAdminCoursesFromStorage();
      if (hasStoredData) {
        renderAdminCourses();
      }
    }
  } else {
    showPage("home");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const courseForm = document.getElementById("course-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const role = e.submitter.dataset.role;
      const clickedButton = e.submitter;

      const userData = {
        firstName: formData.get("firstName").trim(),
        lastName: formData.get("lastName").trim() || undefined,
        email: formData.get("email").trim(),
        password: formData.get("password"),
      };

      if (!validateSignupForm(userData)) {
        return;
      }

      const originalText = clickedButton.textContent;
      clickedButton.disabled = true;
      clickedButton.textContent = originalText.replace(
        "Sign Up",
        "Signing Up..."
      );

      try {
        console.log("[v0] Sending signup request...");
        const endpoint =
          role === "admin"
            ? "http://learnsphere-vercel.api.deepak.cfd/api/v1/admin/signup"
            : "http://learnsphere-vercel.api.deepak.cfd/api/v1/user/signup";

        console.log("[v0] Signup endpoint:", endpoint);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
          const successMessage =
            role === "admin"
              ? "Admin account created successfully! Please sign in to continue."
              : "Account created successfully! Please sign in to continue.";

          alert(successMessage);
          e.target.reset();
          showLogin();
        } else {
          let errorMessage = "Signup failed. Please try again.";

          if (result.error) {
            if (Array.isArray(result.error)) {
              errorMessage = result.error.map((err) => err.message).join("\n");
            } else {
              errorMessage = result.error;
            }
          }

          alert(errorMessage);
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("Network error. Please check your connection and try again.");
      } finally {
        clickedButton.disabled = false;
        clickedButton.textContent = originalText;
      }
    });
  }

  if (courseForm) {
    courseForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const courseData = {
        title: formData.get("title").trim(),
        description: formData.get("description").trim(),
        price: Number.parseFloat(formData.get("price")),
        imageUrl: formData.get("image").trim(),
      };

      if (!validateCourseForm(courseData)) {
        return;
      }

      const submitBtn = document.getElementById("course-submit-btn");
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = currentCourseId ? "Updating..." : "Creating...";

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Authentication required. Please log in again.");
          return;
        }

        if (currentCourseId) {
          const updateData = { ...courseData, courseId: currentCourseId };

          const response = await fetch(
            "http://learnsphere-vercel.api.deepak.cfd/api/v1/admin/update-course",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify(updateData),
            }
          );

          const result = await response.json();

          if (response.ok) {
            alert(`"${courseData.title}" has been updated successfully!`);
          } else {
            let errorMessage = "Failed to update course. Please try again.";

            if (result.error) {
              if (Array.isArray(result.error)) {
                errorMessage = result.error
                  .map((err) => err.message)
                  .join("\n");
              } else {
                errorMessage = result.error;
              }
            }

            alert(errorMessage);
            return;
          }
        } else {
          const response = await fetch(
            "http://learnsphere-vercel.api.deepak.cfd/api/v1/admin/create-course",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify(courseData),
            }
          );

          const result = await response.json();

          if (response.ok) {
            alert(`"${courseData.title}" has been created successfully!`);
          } else {
            let errorMessage = "Failed to create course. Please try again.";

            if (result.error) {
              if (Array.isArray(result.error)) {
                errorMessage = result.error
                  .map((err) => err.message)
                  .join("\n");
              } else {
                errorMessage = result.error;
              }
            }

            alert(errorMessage);
            return;
          }
        }

        closeCourseModal();
        loadAdminCourses();
      } catch (error) {
        console.error("Course operation error:", error);
        alert("Network error. Please check your connection and try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("[v0] Login form submitted");

      const formData = new FormData(e.target);
      const role = e.submitter.dataset.role;
      const clickedButton = e.submitter;

      const loginData = {
        email: formData.get("email").trim(),
        password: formData.get("password"),
      };

      console.log("[v0] Login data prepared:", {
        email: loginData.email,
        password: "***",
      });

      const originalText = clickedButton.textContent;
      clickedButton.disabled = true;
      clickedButton.textContent = originalText.replace(
        "Login",
        "Logging in..."
      );

      try {
        console.log("[v0] Sending login request to backend...");
        const endpoint =
          role === "admin"
            ? "http://learnsphere-vercel.api.deepak.cfd/api/v1/admin/login"
            : "http://learnsphere-vercel.api.deepak.cfd/api/v1/user/login";

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        console.log("[v0] Login response status:", response.status);
        const result = await response.json();
        console.log("[v0] Login response data:", result);

        if (response.ok) {
          if (result.token) {
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("userRole", role);
            console.log("[v0] JWT token stored in localStorage");
          }

          try {
            const token = localStorage.getItem("authToken");
            console.log("[v0] Making /me request with token...");
            const meEndpoint =
              role === "admin"
                ? "http://learnsphere-vercel.api.deepak.cfd/api/v1/admin/me"
                : "http://learnsphere-vercel.api.deepak.cfd/api/v1/user/me";

            const userResponse = await fetch(meEndpoint, {
              method: "GET",
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            });

            console.log("[v0] /me response status:", userResponse.status);
            const userData = await userResponse.json();
            console.log("[v0] /me response data:", userData);

            if (userResponse.ok) {
              currentUser = userData;
              saveUserDataToStorage(userData, role);
              e.target.reset();

              if (role === "admin") {
                document.getElementById("admin-greeting").textContent =
                  userData.message;
                showAdminDashboard();
              } else {
                document.getElementById("user-greeting").textContent =
                  userData.message;
                showCourses();
              }

              console.log("[v0] User greeting set, redirected to dashboard");
            } else {
              console.log("[v0] /me request failed:", userData.error);
              alert(
                "Failed to get user information: " +
                  (userData.error || "Unknown error")
              );
            }
          } catch (error) {
            console.error("[v0] User info error:", error);
            alert(
              "Network error while getting user information. Please try again."
            );
          }
        } else {
          let errorMessage = "Login failed. Please check your credentials.";

          if (result.error) {
            errorMessage = result.error;
          }

          console.log("[v0] Login failed:", errorMessage);
          alert(errorMessage);
        }
      } catch (error) {
        console.error("[v0] Login network error:", error);
        alert("Network error. Please check your connection and try again.");
      } finally {
        clickedButton.disabled = false;
        clickedButton.textContent = originalText;
      }
    });
  }

  const heroElements = document.querySelectorAll(
    ".hero-title, .hero-description, .hero-stats, .hero-actions"
  );
  heroElements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";

    setTimeout(() => {
      element.style.transition = "all 0.6s ease";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, index * 200);
  });

  const learningCard = document.querySelector(".learning-card");
  if (learningCard) {
    learningCard.style.opacity = "0";
    learningCard.style.transform = "translateY(30px)";

    setTimeout(() => {
      learningCard.style.transition = "all 0.8s ease";
      learningCard.style.opacity = "1";
      learningCard.style.transform = "translateY(0)";
    }, 800);
  }

  function addInputValidation() {
    const inputs = document.querySelectorAll("input[required]");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
          input.style.borderColor = "#ef4444";
        } else {
          input.style.borderColor = "#10b981";
        }
      });

      input.addEventListener("input", () => {
        if (
          input.style.borderColor === "#ef4444" &&
          input.value.trim() !== ""
        ) {
          input.style.borderColor = "#10b981";
        }
      });
    });
  }

  addInputValidation();

  document.getElementById("course-modal").addEventListener("click", (e) => {
    if (e.target.id === "course-modal") {
      closeCourseModal();
    }
  });

  initializeTheme();
});

async function purchaseCourse(courseId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You must be logged in to purchase a course.");
    return;
  }

  try {
    const response = await fetch(
      "http://learnsphere-vercel.api.deepak.cfd/api/v1/user/purchase-course",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ courseId }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert(result.message || "Course purchased successfully!");

      if (typeof window.loadPurchasedCourses === "function") {
        window.loadPurchasedCourses();
      }
      if (typeof window.loadAvailableCourses === "function") {
        window.loadAvailableCourses();
      }
    } else {
      alert("Failed to purchase: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Purchase error:", error);
    alert("Network error while purchasing course.");
  }
}

if (typeof window.loadPurchasedCourses !== "function") {
  window.loadPurchasedCourses = async function () {
    const purchasedCoursesGrid = document.getElementById(
      "purchased-courses-grid"
    );
    if (!purchasedCoursesGrid) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        purchasedCoursesGrid.innerHTML = `<p style="text-align:center; color:var(--text-secondary);">Login to view purchased courses.</p>`;
        return;
      }

      const response = await fetch(
        "http://learnsphere-vercel.api.deepak.cfd/api/v1/user/my-purchased-courses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.purchasedCourses) {
        if (result.purchasedCourses.length === 0) {
          purchasedCoursesGrid.innerHTML = `
            <p style="grid-column:1 / -1; text-align:center; color:var(--text-secondary);">
              No purchased courses found!
            </p>`;
          return;
        }

        purchasedCoursesGrid.innerHTML = result.purchasedCourses
          .map(
            (p) => `
            <div class="purchased-course-card">
              <span class="purchased-badge">Purchased</span>
              <img src="${p.imageUrl}" alt="${p.title}" class="course-image" />
              <div class="course-content">
                <h3 class="course-title">${p.title}</h3>
                <p class="course-description">${p.description}</p>
                <div class="course-meta">
                  <div class="course-creator"><strong>By:</strong> ${
                    p.creatorName || "Instructor"
                  }</div>
                  <div class="course-price">$${p.price}</div>
                </div>
                <button class="course-purchase" disabled>Contents</button>
              </div>
            </div>
          `
          )
          .join("");
      } else {
        purchasedCoursesGrid.innerHTML = `<p style="text-align:center; color:red;">${
          result.error || "Failed to load purchased courses"
        }</p>`;
      }
    } catch (error) {
      console.error("Error loading purchased courses:", error);
      purchasedCoursesGrid.innerHTML = `<p style="text-align:center; color:red;">Network error while fetching purchased courses.</p>`;
    }
  };
}

if (typeof window.loadAvailableCourses !== "function") {
  window.loadAvailableCourses = async function () {
    const coursesGrid = document.getElementById("courses-grid");
    if (!coursesGrid) return;

    try {
      const token = localStorage.getItem("authToken");

      const coursesResp = await fetch(
        "http://learnsphere-vercel.api.deepak.cfd/api/v1/course/all-courses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const coursesData = await coursesResp.json();

      let purchasedIds = [];
      if (token) {
        const purchasedResp = await fetch(
          "http://learnsphere-vercel.api.deepak.cfd/api/v1/user/my-purchased-courses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const purchasedData = await purchasedResp.json();
        if (purchasedResp.ok && purchasedData.purchasedCourses) {
          purchasedIds = purchasedData.purchasedCourses.map((c) => c._id);
        }
      }

      if (coursesResp.ok && coursesData.courses) {
        coursesGrid.innerHTML = coursesData.courses
          .map((course) => {
            const isPurchased = purchasedIds.includes(course._id);
            return `
              <div class="course-card">
                <img src="${course.imageUrl}" alt="${
              course.title
            }" class="course-image" />
                <div class="course-content">
                  <h3 class="course-title">${course.title}</h3>
                  <p class="course-description">${course.description}</p>
                  <div class="course-meta">
                    <div class="course-creator"><strong>By:</strong> ${
                      course.creatorName || "Instructor"
                    }</div>
                    <div class="course-price">$${course.price}</div>
                  </div>
                  ${
                    isPurchased
                      ? `<button class="course-purchase" disabled>Contents</button>`
                      : `<button class="course-purchase" onclick="purchaseCourse('${course._id}')">Purchase this course</button>`
                  }
                </div>
              </div>
            `;
          })
          .join("");
      } else {
        coursesGrid.innerHTML = `<p style="text-align:center; color:red;">${
          coursesData.error || "Failed to load courses"
        }</p>`;
      }
    } catch (error) {
      console.error("Error loading available courses:", error);
      coursesGrid.innerHTML = `<p style="text-align:center; color:red;">Network error while fetching courses.</p>`;
    }
  };
}

const originalShowAvailableCourses = window.showAvailableCourses;
window.showAvailableCourses = function () {
  if (originalShowAvailableCourses) originalShowAvailableCourses();
  if (typeof window.loadAvailableCourses === "function")
    window.loadAvailableCourses();
};

const originalShowPurchasedCourses = window.showPurchasedCourses;
window.showPurchasedCourses = function () {
  if (originalShowPurchasedCourses) originalShowPurchasedCourses();
  if (typeof window.loadPurchasedCourses === "function")
    window.loadPurchasedCourses();
};
