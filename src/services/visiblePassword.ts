import { ref } from "vue";

export const visible = ref(false);
export const toggleVisibility = () => {
  visible.value = !visible.value;
};