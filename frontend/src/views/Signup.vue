<template>
  <h1>Create Account</h1>
  <div class="signup-container">
    <form @submit.prevent="signup">
      <div>
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          @blur="validateUsername"
        />
        <span v-if="errors.username" class="error">{{ errors.username }}</span>
      </div>

      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" @blur="validateEmail" />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <div>
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          @blur="validatePassword"
        />
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>

      <button
        class="btn btn-primary"
        type="submit"
        :disabled="!createButtonEnabled"
      >
        Create Account
      </button>
    </form>

    <div class="toggle-container">
      <span>Already have an account?</span>
      <router-link to="/login" class="btn-link">Login</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useUserStore } from "../store/user";
import { useToast } from "vue-toastification";
import User from "../models/user";
import { ObjectId } from "bson";
import router from "../router/index";

const userStore = useUserStore();
const toast = useToast();

const username = ref("");
const email = ref("");
const password = ref("");
const errors = reactive({ username: "", email: "", password: "" });

// --- Validation functions ---
const validateUsername = () => {
  errors.username = "";
  const regex = /^[A-Za-z0-9_]+$/;
  if (!username.value) errors.username = "Username required";
  else if (username.value.length < 6) errors.username = "At least 6 characters";
  else if (!regex.test(username.value))
    errors.username = "Only letters, numbers, _";
};

const validateEmail = () => {
  errors.email = "";
  if (!email.value) errors.email = "Email required";
  else if (!/\S+@\S+\.\S+/.test(email.value)) errors.email = "Invalid email";
};

const validatePassword = () => {
  errors.password = "";
  if (!password.value) errors.password = "Password required";
  else if (password.value.length < 8) errors.password = "At least 8 characters";
};

// --- Computed property for button enabled ---
const createButtonEnabled = computed(() => {
  return (
    username.value &&
    email.value &&
    password.value &&
    !errors.username &&
    !errors.email &&
    !errors.password
  );
});

// --- Signup function ---
const signup = async () => {
  // run validations before submit
  validateUsername();
  validateEmail();
  validatePassword();

  if (!createButtonEnabled.value) return;

  const response = await userStore.signup(
    new User(
      new ObjectId().toHexString(),
      username.value,
      email.value,
      password.value,
      [],
      "web",
    ),
  );
  if (response === true) {
    toast.success("Account created!");
    router.push({
      name: "login",
      query: {
        username: username.value,
      },
    });
  } else {
    toast.error("Failed to create account");
  }
};
</script>

<style scoped>
/* Container */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

/* Form card */
form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.4s ease-in-out;
}

/* Title */
h1 {
  text-align: center;
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #374151;
}

/* Form layout */
form div {
  margin-bottom: 1.25rem;
}

/* Labels */
label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #374151;
}

/* Inputs */
input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-size: 0.95rem;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Error text */
.error {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* Primary buttons */
.btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    transform 0.1s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.toggle-container {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
  color: #4b5563;
}

.toggle-container button,
.toggle-container a {
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.3rem;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.toggle-container button:hover,
.toggle-container a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
