<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">Dashboard</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/weather">Weather</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/todo">Todo</RouterLink>
                    </li>
                </ul>
                <div class="navbar-text mx-auto ps-auto">{{ weatherStore.hourlyForecast[0].temperature }}&#176;F
                    {{ weatherStore.hourlyForecast[0].short_forecast }}</div>
                <button class="btn btn-primary" @click="handleAuthButton">
                    {{ userStore.signedIn ? "Logout" : "Login" }}
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router';
import { useWeatherStore } from '../store/weather';
import { useUserStore } from '../store/user';

const router = useRouter();
const weatherStore = useWeatherStore();
const userStore = useUserStore();

async function handleAuthButton() {
    if (userStore.signedIn) {
        await userStore.logout();
        await router.push('/')
    } else {
        await router.push('/login')
    }
}

</script>

<style scoped>
.navbar {
    background: linear-gradient(90deg, #1e3a8a, #2563eb);
    min-height: 48px;
    padding: 0.25rem 0.75rem;
}

.navbar-brand {
    font-weight: 600;
    font-size: 1rem;
    color: white !important;
}

.nav-link {
    color: white !important;
    font-size: 0.9rem;
}

.navbar-text {
    background: rgba(255, 255, 255, 0.15);
    padding: 0.15rem 0.5rem;
    border-radius: 6px;
    font-size: 0.8rem;
    color: white;
    margin: 0 auto;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.navbar .btn-primary {
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
}

@media (max-width: 992px) {
    .navbar-text {
        margin: 0.5rem 0;
        max-width: none;
    }
}
</style>
