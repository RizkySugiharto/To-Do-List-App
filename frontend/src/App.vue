<template>
  <div>
    <NavigationBar />
    <div class="d-flex justify-content-center">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'

export default {
  name: 'App',
  components: {
    NavigationBar
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
